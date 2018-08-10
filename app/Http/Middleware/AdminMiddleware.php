<?php

namespace App\Http\Middleware;

use Closure;

class AdminMiddleware extends Middleware
{
    public function handle($request, Closure $next)
    {
        $token = $request->header('token');
        $token = $token?$token:$request->input('token','');
        if(!$token){
            return response(Response::TokenError(trans("HttpRequest.Error.ParamsMissing",["Param" => "token"])));
        }

        $Encryption = new Encryption();
        $TokenData = $Encryption->decode($token);
        $TokenData = json_decode($TokenData,true);
        if(!$TokenData["user_id"]){
            return response(Response::TokenError(trans("ResponseMsg.User.Token.TokenError")));
        }

        $TokenTime = RedisServer::get($token);
        if(!$TokenTime){
            return response(Response::TokenError(trans("ResponseMsg.User.Token.TokenNotFound")));
        }

        if($TokenTime != $TokenData["time"]){
            return response(Response::TokenError(trans("ResponseMsg.User.Token.TokenError")));
        }

        RedisServer::expire($token,604800);
        define("UID",$TokenData["user_id"]);
        isset($TokenData["user_type"]) AND define("UTYPE", $TokenData["user_type"]) OR define("UTYPE", 'seller');
        @isset($TokenData["manager_id"]) AND define("MANAGER_ID", $TokenData["manager_id"]) OR define("MANAGER_ID", 0);
        return $next($request);
    }
}