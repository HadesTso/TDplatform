<?php

namespace App\Http\Middleware;

use App\Libray\Response;
use Closure;

class AdminMiddleware
{
    public function handle($request, Closure $next)
    {
        $admin_id = \Session::get('admin_id');
        if (empty($admin_id)){
            return Response::NotLogin('no_login');
        }
        return '';
//        $token = $request->header('token');
//        $token = $token?$token:$request->input('token','');
//        if(!$token){
//            return response(Response::NotLogin('未登录'));
//        }
//
//        $Encryption = new Encryption();
//        $TokenData = $Encryption->decode($token);
//        $TokenData = json_decode($TokenData,true);
//        $TokenTime = session()->get($token);
//        if(!$TokenTime){
//            return response(Response::NotLogin('token不存在'));
//        }
//
//        session()->put($token,time(),86400);
//        define("UID",$TokenData["user_id"]);
//        return $next($request);
    }
}