<?php

namespace App\Http\Middleware;

use Closure;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
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
//        header("Access-Control-Allow-Origin:*");
//
//        // ALLOW OPTIONS METHOD
//        $headers = [
//            'Access-Control-Allow-Methods'=> 'POST, GET, OPTIONS, PUT, DELETE',
//            'Access-Control-Allow-Headers'=> 'Content-Type, token, consumer_token,Origin',
//            //'Access-Control-Allow-Credentials'=> 'true',
//        ];

        $response = $next($request);
        if($response instanceof RedirectResponse){
            return $response;
        }

        $response->headers->add([
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods'=> 'POST, GET, OPTIONS, PUT, DELETE',
            'Access-Control-Allow-Headers'=> 'Content-Type, token, consumer_token,Origin'
        ]);

//        foreach($headers as $key => $value){
//            $response->headers->add([
//                'Access-Control-Allow-Origin' => '*',
//                'Access-Control-Allow-Methods'=> 'POST, GET, OPTIONS, PUT, DELETE',
//                'Access-Control-Allow-Headers'=> 'Content-Type, token, consumer_token,Origin'
//            ]);
//        }
        return $response;

    }
}
