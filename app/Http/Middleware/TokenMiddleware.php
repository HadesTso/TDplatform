<?php

namespace App\Http\Middleware;

use App\Libray\Response;
use Closure;
use App\Libray\Encryption;
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
        $token = $request->header('token');
        $token = $token?$token:$request->input('token','');
        if(!$token){
            return response(Response::NotLogin('未登录'));
        }

        $Encryption = new Encryption();
        $TokenData = $Encryption->decode($token);
        $TokenData = json_decode($TokenData,true);
        $TokenTime = session()->get($token);
        if(!$TokenTime){
            return response(Response::NotLogin('token不存在'));
        }
        
        session()->put($token,time(),86400);
        define("UID",$TokenData["user_id"]);
        return $next($request);
    }
}
