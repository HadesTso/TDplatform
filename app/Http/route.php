<?php

Route::get('/', function (\Illuminate\Http\Request $request) {
    return response('home page');
})->middleware(['web']);


// 错误监控
Route::get('logs','\Rap2hpoutre\LaravelLogViewer\LogViewerController@index');


Route::any('wechat', 'WechatController@serve');

Route::any('wechat/login','LoginController@wechatLogin');
Route::get('wechat/oauth/callback','WechatController@OauthCallback');

// 用户信息
Route::get('personal/info','UserController@personalCenter');
// 绑定支付宝账号
Route::post('binding/alipay','UserController@bindingAliPay');

// 获取验证码
Route::post('send/message','Message\MessageController@getCode');
// 检验验证码
Route::post('check/code','Message\MessageController@checkCode');

// 应用列表
Route::get('app/list','ApplyController@appList');

Route::post('withdraw','WithdrawController@withdraw');
Route::get('withdraw/list','WithdrawController@withdrawList');

Route::get('amWiki','UserController@amWiki');

Route::group(['middleware' => ['wechat.oauth']], function () {
  Route::get('/auth','LoginController@wechatAuth');
});

/*需要登录的接口*/
Route::group(['middleware' => 'AuthToken','prefix' => 'auth'],function(){

});
//后台接口
Route::group(
    ['prefix' => 'admin', 'namespace'=>'Admin'], function(){
    Route::group(['prefix' => 'app'], function(){
        Route::get('list', 'ApplyController@index');
        Route::get('info', 'ApplyController@index');
    });
});