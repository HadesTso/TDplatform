<?php
/**
 * Created by PhpStorm.
 * User: cao
 * Date: 4/8/2018
 * Time: 3:41 PM
 */

namespace App\Http\Middleware;

use App\Libray\Encryption;
use App\Libray\Response;
use Closure;

class AuthenticationMiddleware
{

    /**
     * @param $request
     * @param Closure $next
     * @return \Illuminate\Contracts\Routing\ResponseFactory|mixed|\Symfony\Component\HttpFoundation\Response
     */
    public function handle($request, Closure $next)
    {
        $token = $request->header('token');
        $token = $token?$token:$request->input('token','');
        if (!$token){
            return response(Response::TokenError(trans("HttpRequest.Error.ParamsMissing",["Param" => "token"])));
        }

        $Encryption = new Encryption();
        $TokenData = $Encryption->decode($token);
        $TokenData = json_decode($TokenData,true);
        if (!$TokenData){
            return response(Response::TokenError(trans("ResponseMsg.User.Token.TokenNotFound")));
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
        return $next($request);
    }
}