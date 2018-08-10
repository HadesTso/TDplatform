<?php
/**
 * Created by PhpStorm.
 * User: cao
 * Date: 8/8/2018
 * Time: 12:09 AM
 */

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
     * 获取手机验证码
     *
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function getCode(Request $request) {
        $mobile = $request->input('mobile');
        $flag = $request->input('flag');

        if ($flag == 'binding') {
            // 判断手机号是否已绑定
            $count = User::where('mobile', $mobile)->count();
            if ($count > 0) {
                return response(Response::Error('该手机号码已被绑定！'));
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
            return response(Response::Success('验证码发送成功'));
        }

        return response(Response::Error('验证码发送失败，请重试！'));
    }

    /**
     *
     * 检测验证码是否正确
     *
     * @param $phone string
     * @param $use_type integer
     *
     * @return bool
     */
    public function checkCode(Request $request,User $userModel) {
        $mobile = $request->input('mobile');
        $code = $request->input('code');
        $m = Message::where([
            'phone'     => $mobile,
            'type'      => 1,
            'user_id'   => 1,
        ])->orderBy('id', 'DESC')->first();
         if (empty($m)) {
            return response(Response::Error('验证码不存在'));
        }
         // 最后一条是验证成功过的数据
        if ($m->status == 1) {
            return response(Response::Error('验证码错误'));
        }
         // 判断验证码是否过期
        if (strtotime($m->created_at) + $m->expire_minutes * 60 < time()) {
            return response(Response::Error('验证码已过期'));
        }
         // 判断验证次数
        if ($m->check_times >= config('app.max_check_times')) {
            return response(Response::Error('已超过验证次数'));
        }
         // 验证码错误，验证次数+1
        if ($m->code != $code) {
            $m->check_times = $m->check_times + 1;
            $m->save();
            return response(Response::Error('验证码错误'));
        }
        $flag = $userModel->where(['mobile' => $mobile])->first();
        DB::beginTransaction();
        try{
            $m->status = 1;
            $b = $m->save();
            if (!$flag){
                if ($b) {
                    $userModel->where([
                        'user_id' => 1
                    ])->update([
                        'mobile' => $mobile
                    ]);
                }
                $flag = false;
            }
            DB::commit();
            if (!$flag){
                return response(Response::Success('绑定手机成功'));
            }else{
                return response(Response::Success('验证手机成功'));
            }
        }catch (\Exception $exception){
            DB::rollBack();
            return response(Response::Error(trans("ResponseMsg.User.binding.Fail")));
        }
    }
}