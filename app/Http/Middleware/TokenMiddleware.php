<?php

namespace App\Http\Middleware;

use App\Libray\Response;
use App\User;
use Closure;
use App\Libray\Encryption;
use Illuminate\Support\Facades\Session;

class TokenMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $uid = Session::get('uid');
        if (empty($uid)){
            return Response::NotLogin('no_login');
        }
//        $token = $request->header('token');
//        $token = $token?$token:$request->input('token','');
//        if(!$token){
//            return response(Response::NotLogin('未登录'));
//        }
//
//        $Encryption = new Encryption();
//        $TokenData = $Encryption->decode($token);
//        $TokenData = json_decode($TokenData,true);
//        $userModel = new User();
//        $user = $userModel->where('user_id',$TokenData['user_id'])->first();
//        if ($user->status == 0){
//            return response(Response::Error('账户已被禁禁用'));
//        }
//        $TokenTime = session()->get($token);
//        if(!$TokenTime){
//            return response(Response::NotLogin('token不存在'));
//        }
//
//        session()->put($token,time(),86400);
//        define("UID",$TokenData["user_id"]);
        return $next($request);
    }
}
