<?php


namespace App\Http\Controllers;

use App\Libray\Message\sendSMS;
use App\Libray\Response;
use App\Model\Message;
use App\Model\User;
use Illuminate\Http\Request;
use App\Libray\Encryption;
use Illuminate\Support\Facades\Input;

class WechatController extends Controller
{
    public function wechatLogin(Request $request,User $userModel)
    {
        $code = $request->input('code');
        $appid = $request->input('appid');
        $type = $request->input('type');
        if (empty($code) || empty($appid) || is_null($type)){
            return Response::Error('缺少参数');
        }
        $secret = config('app.'.$appid);

        if (empty($secret)){
            return response(Response::Error('appid错误'));
        }

        $getToken_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid={$appid}&secret={$secret}&code={$code}&grant_type=authorization_code";

        $result = self::curl($getToken_url);

        $res = json_decode($result,true);

        if(!$res){
            return response(Response::Error('授权失败'));
        }

        $userInfo = $userModel->where([
            'openid' => $res['openid'],
            'type'   => $type,
        ])->first();

        if ($userInfo){
            if ($userInfo->status == 0){
                return response(Response::Error('账户已被禁用'));
            }
            $Token = $this->setLoginInfo($userInfo);
            $data = [
                    'token'    => $userInfo->token,
                    'user_id'  => $userInfo->user_id,
                    'head_img' => $userInfo->head_img,
                    'nickname' => $userInfo->nickname,
                    'mobile'   => $userInfo->mobile,
                ];
            return response(Response::Success($data));
        }else{
            $getOpenid_url = "https://api.weixin.qq.com/sns/userinfo?access_token={$res['access_token']}&openid={$res['openid']}";
            $data = self::curl($getOpenid_url);
            $wechatInfo = json_decode($data,true);
            $User = $userModel->newInstance();
            $User->head_img = $wechatInfo['headimgurl'];
            $User->nickname = $wechatInfo['nickname'];
            $User->openid = $wechatInfo['openid'];
            $User->type = $type;
            $User->token = strtolower(str_random(10));
            $b = $User->save();

            if ($b){
                $Token = $this->setLoginInfo($User);
                $data = [
                    'token' => $User->token,
                    'user_id' => $b,
                    'head_img' => $User->head_img,
                    'nickname' => $User->nickname,
                ];
                session()->put('uid', $data['user_id']);
                session()->put('nickname', $data['nickname']);
                session()->put('type', $type);
                return Response::Success($data);
            }
            return Response::Error('登录失败');
        }
    }

    public static function curl($url, $params = false, $ispost = 0, $https = 0)
    {
        $httpInfo = array();
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36');
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        if ($https) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE); // 对认证证书来源的检查
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE); // 从证书中检查SSL加密算法是否存在
        }
        if ($ispost) {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
            curl_setopt($ch, CURLOPT_URL, $url);
        } else {
            if ($params) {
                if (is_array($params)) {
                    $params = http_build_query($params);
                }
                curl_setopt($ch, CURLOPT_URL, $url . '?' . $params);
            } else {
                curl_setopt($ch, CURLOPT_URL, $url);
            }
        }

        $response = curl_exec($ch);

        if ($response === FALSE) {
            //echo "cURL Error: " . curl_error($ch);
            return false;
        }
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $httpInfo = array_merge($httpInfo, curl_getinfo($ch));
        curl_close($ch);
        return $response;
    }

    protected function setLoginInfo($user){
        $Token = [
            'openid'  => $user->openid,
            'user_id' => $user->user_id,
            'time'    => time(),
        ];

        $Encryption = new Encryption();
        $Token = $Encryption->encode(json_encode($Token));
        session()->put('uid', $user->user_id);
        session()->put('nickname', $user->nickname);
        session()->put('type', $user->type);
        session()->put($Token,time(),86400);
        return ['Token' => $Token];
    }

    /**
     * 自动登陆接口
     */
    public function AutoLogin()
    {
        $token     = Input::get('token');
        $user_id   = Input::get('user_id');
        $signature = Input::get('signature', '');
        $timestamp = Input::get('timestamp', '');


//        //获取是否有该登陆人员
        $user_row = (new User())->where('user_id','=',$user_id)->first();
        if(empty($user_row)) {
            return Response::Error('不存在该账号');
        }
//
        //验证token是否正确
        if($token != $user_row['token']) {
            return Response::Error('token错误');
        }
        if(empty($user_row['status']))
        {
            return Response::Error('该用户已被禁用');
        }
        //验证签名是否正确
        $sign['token']             = $token;
        $sign['user_id']           = $user_id;
        $sign['timestamp']         = $timestamp;
        ksort($sign);
        $sign_str = implode('', $sign);
        if(sha1($sign_str) != $signature) {
            return Response::Error('签名错误');
        }
        //存session
        session()->put('uid', $user_row->user_id);
        session()->put('nickname', $user_row->nickname);
        session()->put('type', $user_row->type);
        return Response::Success('自动登录成功');
    }

    public function MobileLogin(Request $request, User $userModel)
    {
        $mobile = $request->input('mobile');
        $code = $request->input('code');
        $type = $request->input('type');
        \Log::info('登录手机号：----'.$mobile);
        if (empty($mobile) || empty($code) || is_null($type)){
            return Response::Error('缺少参数');
        }
//        $a = new sendSMS();
//        $massage = $a->checkCode($mobile, $code);

//        if ($massage){
            $user = $userModel->where([
                'mobile' => $mobile,
                'type'   => $type
            ])->first();
            if (!$user) {
                $User = $userModel->newInstance();
                $User->mobile = $mobile;
                $User->type   = $type;
                $User->token   = strtolower(str_random(10));
                $User->created_at   = date('Y-m-d H:i:s',time());
                $User->updated_at   = date('Y-m-d H:i:s',time());
                $id = $User->save();
                $data = [
                    'user_id' => $id,
                    'head_img' => '',
                    'nickname' => $User->mobile,
                    'token' => $User->token,
                ];
            }else{
                $data = [
                    'user_id' => $user->user_id,
                    'head_img' => $user->head_img,
                    'nickname' => $user->nickname,
                    'token' => $user->token,
                ];
            }
            session()->put('uid', $data['user_id']);
            session()->put('nickname', $data['nickname']);
            session()->put('type', $type);
            return Response::Success($data);
//        }
        return Response::Error('验证码错误');
    }

    public function logout()
    {
        session()->put('uid', null);
        session()->put('nickname', null);
        session()->put('type', null);
        return response(Response::Success('退出登录成功'));
    }
}