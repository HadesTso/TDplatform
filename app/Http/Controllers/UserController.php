<?php
/**
 * Created by PhpStorm.
 * User: cao
 * Date: 7/8/2018
 * Time: 6:37 PM
 */


namespace App\Http\Controllers;

use App\Libray\Response;
use App\Model\User;
use Illuminate\Http\Request;

class UserController extends Controller
{


    public function test(Request $resquest)
    {
        $test = $resquest->input('test');

        return response(Response::Success($test));
    }

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
}