<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Http\Requests\bindingAliPayCodeRequestValidation;
use App\Libray\Message\sendSMS;
use App\Libray\Response;
use App\Model\User;
use App\Model\Message;


class MessageController extends Controller
{
    /** 发送绑定支付宝账号短信
     * @param bindingAliPayCodeRequestValidation $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function bindingAliPayCode(bindingAliPayCodeRequestValidation $request) {
        $mobile = $request->input('mobile');
        // 判断手机号是否已绑定
        $count = User::where('mobile', $mobile)->count();
        if ($count > 0) {
            return response(Response::Error('该手机号码已被绑定！'));
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
}
