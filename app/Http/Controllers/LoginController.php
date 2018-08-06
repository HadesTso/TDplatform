<?php
/**
 * Created by PhpStorm.
 * User: cao
 * Date: 6/8/2018
 * Time: 2:06 PM
 */

namespace App\Http\Controllers;

class LoginController extends Controller
{
    public function wechatLogin(WechatRegisterRequestValidation $request,User $userModel){
        $userType = $request->input('type');
        try{
            /**
             * @var $wechatUser \Overtrue\Socialite\User
            */
            $wechatUser = app()->make('easyWechat')->oauth->setRequest($request)->user();
            $origin = $wechatUser->getOriginal();
            $oauthMode = $wechatUser->getToken()->scope;
        }catch (\Exception $exception){
            return Response::Error(trans('ResponseMsg.User.Wechat.AuthError'));
        }

        $user = $userModel->where([
            "openid" => $origin['openid'],
            "user_type" => $userType
        ])->first();
        if(!$user){
            DB::beginTransaction();
            try{
                $model = $userModel->newInstance();
                $model->openid = $origin['openid'];
                $model->user_type = $userType;
                $model->save();

                $wechatInfoModel = new UserWechatInfo();
                $wechatInfoModel->user_id = $model->id;
                $wechatInfoModel->openid = $origin['openid'];
                if($oauthMode == 'snsapi_userinfo'){
                    $wechatInfoModel->nickname = $origin['nickname'];
                    $wechatInfoModel->sex = $origin['sex'];
                    $wechatInfoModel->city = $origin['city'];
                    $wechatInfoModel->province = $origin['province'];
                    $wechatInfoModel->country = $origin['country'];
                    $wechatInfoModel->headimgurl = $origin['headimgurl'];
                }
                $wechatInfoModel->save();
                DB::commit();
                $token = $this->setLoginInfo($model);
                return response(Response::Success($token));
            }catch (\Exception $exception){
                \Log::info($exception);
                DB::rollBack();
                return response(Response::Error());
            }
        }

        if($oauthMode == 'snsapi_userinfo'){
            $userWechatInfo = $user->userWechatInfo('status','enable')->first();
            $userWechatInfo->nickname = $origin['nickname'];
            $userWechatInfo->sex = $origin['sex'];
            $userWechatInfo->city = $origin['city'];
            $userWechatInfo->province = $origin['province'];
            $userWechatInfo->country = $origin['country'];
            $userWechatInfo->headimgurl = $origin['headimgurl'];
            $userWechatInfo->save();
        }
        $token = $this->setLoginInfo($user);
        return response(Response::Success($token));
    }
}