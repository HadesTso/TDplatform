<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Libray\Message\sendSMS;
use App\Libray\Response;
use App\Model\User;
use App\Model\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class MessageController extends Controller
{
    /**
     *
     * 获取验证码
     *
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function getCode(Request $request) {
        $mobile = $request->input('mobile');
        $flag = $request->input('flag');

        if ($flag == 'binding') {
            // 判断手机号是否已绑定
            $count = User::where('mobile',$mobile)
                ->where('openid','!=','')->count();
            if ($count > 0) {
                return response(Response::Error('该手机号码已被绑定,请解绑后重新绑定'));
            }
        }

        // 同一个号码60秒之内不能重复发，无状态，无法用session进行判断
        $message = Message::select('created_at')->where('phone', $mobile)->orderBy('id', 'DESC')->first();

        if ($message && strtotime($message->created_at) + 60 > time()) {
            return response(Response::Error('请稍后重新发送验证码！'));
        }

        $a = new sendSMS();
        $b = $a->bindingAliPay($mobile);
        if ($b) {
            return response(Response::Success_No_Data('验证码发送成功'));
        }

        return response(Response::Error('验证码发送失败，请重试！'));
    }

    /**
     *
     * 验证验证码
     *
     * @param $phone string
     * @param $use_type integer
     *
     * @return bool
     */
    public function checkCode(Request $request,User $userModel) {
        $mobile = $request->input('mobile');
        $code = $request->input('code');
        $flag = $request->input('flag');

//        $a = new sendSMS();
//        $b = $a->checkCode($mobile, $code);
//
//        if (!$b){
//           return response(Response::Error('验证失败'));
//        }

        DB::beginTransaction();
        try{
            if ($flag == 'binding'){
                $res = $userModel->where([
                    'mobile' => $mobile,
                    'type'   => session()->get('type'),
                ])->where('openid','=','')->first();

                if ($res) {
                    $data = $userModel->where([
                        'user_id' => session()->get('uid')
                    ])->first();

                    $userModel->where([
                        'user_id' => session()->get('uid')
                    ])->delete();

                    $userModel->where([
                        'mobile'  => $mobile,
                        'user_id' => $res->user_id
                    ])
                        ->update([
                            'head_img' => $data->head_img,
                            'nickname' => $data->nickname,
                            'openid'   => $data->openid,
                        ]);
                    $data = [
                        'user_id'  => $res->user_id,
                        'head_img' => $data->head_img,
                        'nickname' => $data->nickname,
                    ];
                    session()->put('uid', $res->user_id);
                    session()->put('nickname', $data->nickname);
                    session()->put('type', $res->type);
                    DB::commit();
                    return response(Response::Success($data));
                }else{
                    $userModel->where([
                        'user_id' => session()->get('type')
                    ])->update([
                        'mobile' => $mobile
                    ]);
                }
            }
            DB::commit();
            return response(Response::Success_No_Data('验证成功'));
        }catch (\Exception $exception){
            DB::rollBack();
            return response(Response::Error(trans("ResponseMsg.User.binding.Fail")));
        }
    }
}