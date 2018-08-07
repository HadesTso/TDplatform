<?php
/**
 * Created by PhpStorm.
 * User: cao
 * Date: 8/8/2018
 * Time: 12:03 AM
 */

Route::get('/', function (\Illuminate\Http\Request $request) {
    return response('home page');
})->middleware(['web']);


// 错误监控
Route::get('logs','\Rap2hpoutre\LaravelLogViewer\LogViewerController@index');


Route::any('wechat', 'WechatController@serve');

Route::any('wechat/login','LoginController@wechatLogin');
Route::get('wechat/oauth/callback','WechatController@OauthCallback');

Route::post('user/info','UserController@index');
Route::post('personal/info','UserController@personalCenter');

Route::post('send/message','Message\MessageController@bindingAliPayCode');

Route::group(['middleware' => ['wechat.oauth']], function () {
  Route::get('/auth','LoginController@wechatAuth');
});

Route::group(['prefix' => 'api/v1'],function (){
    Route::post('send/message','Message\MessageController@bindingAliPayCode');

    /*不需要授权的接口*/
    Route::group(['prefix' => 'common'],function(){
        require_once (app_path().'/Http/routes/api.v1.common.php');
    });


    /*需要登录的接口*/
    Route::group(['middleware' => 'AuthToken','prefix' => 'auth'],function(){

    });

});