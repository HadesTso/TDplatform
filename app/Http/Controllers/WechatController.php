<?php
/**
 * Created by PhpStorm.
 * User: cao
 * Date: 6/8/2018
 * Time: 10:31 AM
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Log;

class WechatController extends Controller
{

    /**
     * @var $application Application
     */
    protected $application;
    public function __construct()
    {
        $this->application = app('easyWechat');
    }

    /**
     * 处理微信的请求消息
     *
     * @return string
     */
    public function serve()
    {
        Log::info('request arrived.'); # 注意：Log 为 Laravel 组件，所以它记的日志去 Laravel 日志看，而不是 EasyWeChat 日志

        $app = app('wechat.official_account');
        $app->server->push(function($message){
            return "欢迎关注 overtrue！";
        });

        return $app->server->serve();
    }


    public function OauthCallback()
    {
        $app = app('easywechat');
        $response = $app->oauth->scopes(['snsapi_userinfo'])
                          ->redirect();

        return $response;
    }
}