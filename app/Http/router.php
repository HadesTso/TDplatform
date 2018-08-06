<?php
/**
 * Created by PhpStorm.
 * User: cao
 * Date: 4/8/2018
 * Time: 3:26 PM
 */

Route::get('/', function (\Illuminate\Http\Request $request) {
    return response('home page');
})->middleware(['web']);


// 错误监控
Route::get('logs','\Rap2hpoutre\LaravelLogViewer\LogViewerController@index');


Route::any('/wechat', 'WeChatController@serve');


Route::group(['prefix' => 'api/v1'],function (){

    /*不需要授权的接口*/
    Route::group(['prefix' => 'common'],function(){
        require_once (app_path().'/Http/routers/api.v1.common.php');
    });


    /*需要登录的接口*/
    Route::group(['middleware' => 'AuthToken','prefix' => 'auth'],function(){

    });

});