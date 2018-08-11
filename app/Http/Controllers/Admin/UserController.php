<?php
/**
 * Created by PhpStorm.
 * User: 1
 * Date: 2018/8/11
 * Time: 13:32
 */

namespace App\Http\Controllers\Admin;


use App\Http\Controllers\Controller;
use App\Libray\Response;
use App\Model\Income;
use App\Model\User;
use Illuminate\Support\Facades\Input;

/**
 * 用户控制器
 * Class UserController
 * @package App\Http\Controllers\Admin
 */
class UserController extends Controller
{
    public function index()
    {
        $nickname = Input::get('nickname', '');
        $mobile = Input::get('mobile', '');
        $user_id = Input::get('user_id', '');
        $model = new User();
        if ($nickname){
            $model->where('nickname', 'like', '%'. $nickname. '%');
        }
        if ($mobile){
            $model->where('mobile', 'like', '%'.$model.'%');
        }
        if ($user_id){
            $model->where('user_id', '=', $user_id);
        }
        $list = $model->paginate(20)->toArray();
        $try_num = (new Income())->select('user_id','count `app_id` as try_num')->groupby('user_id')->get();
        $android_total = (new User())->where('type', '=', 1)->count(['user_id']); //安卓用户总数
        $ios_total = (new User())->where('type', '=', 2)->count(['user_id']); //苹果用户总数
        $list['total_count'] = $android_total + $ios_total; //用户总数
        $list['android_count'] = $android_total ;
        $list['ios_count'] = $ios_total ;
        return Response::Success($list);

    }
}