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
use App\Model\Withdraw;
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
        $try_num = (new Income())->select('user_id',\DB::raw('count(app_id) as try_num'))->groupby('user_id')->get();
        if ($try_num){
            $try_num = array_column($try_num, 'user_id');
        }
        if ($list['data']){
            foreach ($list['data'] as &$item){
                if (isset($try_num[$item['user_id']])){
                    $item['try_num'] = $try_num[$item['user_id']]['try_num'];
                }else{
                    $item['try_num'] = 0;
                }
            }
        }
        $android_total = (new User())->where('type', '=', 0)->count('user_id'); //安卓用户总数
        $ios_total = (new User())->where('type', '=', 1)->count(['user_id']); //苹果用户总数
        $list['total_count'] = $android_total + $ios_total; //用户总数
        $list['android_count'] = $android_total ;
        $list['ios_count'] = $ios_total ;
        return Response::Success($list);

    }

    /**
     * 提现处理列表
     */
    public function withdrawList(){
        $status = Input::get('status', 1); //1为待提现 2为提现成功
        $nickname = Input::get('nickname', ''); //用户昵称
        $mobile = Input::get('mobile', ''); //用户手机号码
        $alipay = Input::get('alipay', ''); //提现账号
        $where = [];
        $where[] = ['withdraw.status', '=', $status];
        if ($nickname){
            $where[] = ['user.nickname', 'like', '%'.$nickname.'%'];
        }
        if ($mobile){
            $where[] = ['user.mobile', 'like', '%'.$mobile.'%'];
        }
        if ($alipay){
            $where[] = ['user.alipay', 'like', '%'.$alipay.'%'];
        }
        $model = new Withdraw();
        $list = $model->getList($where);
        //待提现总金额
        $withdraw_count = $model->where('status', '=', $status)->sum('money');
        //待提现处理总数
        $people_count = $model->where('status', '=', $status)->count();
        $list['withdraw_count'] = $withdraw_count;
        $list['people_count'] = $people_count;
        return Response::Success($list);
    }
}