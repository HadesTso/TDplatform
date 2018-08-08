<?php
/**
 * Created by PhpStorm.
 * User: cao
 * Date: 8/8/2018
 * Time: 12:10 AM
 */

namespace App\Http\Controllers;

use App\Libray\Response;
use App\Model\User;
use Illuminate\Http\Request;


class UserController extends Controller
{
    /**
     *
     * 进入页信息
     *
     * @param User $userModel
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function index(User $userModel)
    {
        $userInfo = $userModel->where([
            'user_id' => 1
        ])
            ->select('nickname','head_img','money')
            ->first();

        return response(Response::Success($userInfo));
    }

    /**
     *
     * 个人中心
     *
     * @param User $userModel
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function personalCenter(User $userModel)
    {
        $personaInfo = $userModel->where([
            'user_id' => 1
        ])
            ->select('user_id','nickname','head_img','money','cumulative_amount','is_binding')
            ->first();

        return response(Response::Success($personaInfo));
    }


    /**
     *
     * 绑定支付宝
     *
     * @param User $userModel
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function bindingAliPay(User $userModel,Request $request)
    {
        $alipay = $request->input('alipay');
        $alipay_name = $request->input('alipay_name');

        $user = $userModel->where([
            'user_id' => 1
        ])->first();

        $user->alipay = $alipay;
        $user->alipay_name = $alipay_name;
        $user->is_binding = 1;
        $b = $user->save();

        if ($b){
            return response(Response::Success('绑定提现账号成功'));
        }
        return response(Response::Error('绑定提现账号失败'));
    }
}