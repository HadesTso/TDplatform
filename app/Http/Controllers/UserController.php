<?php

namespace App\Http\Controllers;

use App\Libray\Response;
use App\Model\User;
use Illuminate\Http\Request;


class UserController extends Controller
{
    /**
     * 个人中心
     * @param User $userModel
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function personalCenter(User $userModel)
    {
        $personaInfo = $userModel->where([
            'user_id' => session()->get('uid')
        ])
            ->select('user_id','nickname','head_img','money','cumulative_amount','is_binding','alipay','alipay_name')
            ->first();

        return response(Response::Success($personaInfo));
    }


    /**
     * 绑定修改支付宝
     * @param User $userModel
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function bindingAliPay(User $userModel,Request $request)
    {
        $alipay = $request->input('alipay');
        $alipay_name = $request->input('alipay_name');

        $user = $userModel->where([
            'user_id' => session()->get('uid')
        ])->update([
            'alipay' => $alipay,
            'alipay_name' => $alipay_name,
            'is_binding' => 1
        ]);

        if ($user){
            return response(Response::Success_No_Data('操作成功'));
        }
        return response(Response::Error('操作失败'));
    }

    public function amWiki()
    {
        return view(public_path('amWiki/index.html'));
    }
}