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
    /**
     * 用户列表
     * @return string
     */
    public function index()
    {
        $nickname = Input::get('nickname', '');
        $mobile = Input::get('mobile', '');
        $user_id = Input::get('user_id', '');
        $model = new User();
        $userModel = $model->select();
        if ($nickname){
            $userModel->where('nickname', 'like', '%'. $nickname. '%');
        }
        if ($mobile){
            $userModel->where('mobile', 'like', '%'.$mobile.'%');
        }
        if ($user_id){
            $userModel->where('user_id', '=', $user_id);
        }
        $list = $userModel->paginate(20)->toArray();
        $data = (new Income())->select('user_id',\DB::raw('count(app_id) as try_num'))->groupby('user_id')->get();

        $try_num = json_encode($data);
        $try_num = json_decode($try_num,true);
        if ($try_num){
            $try_num = array_column($try_num, 'try_num', 'user_id');
        }

        if ($list['data']){
            foreach ($list['data'] as &$item){
                if (isset($try_num[$item['user_id']])){
                    //$item['try_num'] = $try_num[$item['user_id']]['try_num'];
                    $item['try_num'] = $try_num[$item['user_id']];
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
        return Response::Success($list,1);

    }

    /**
     * 修改用户状态
     */
    public function updateStatus(){
        $user_id = Input::get('user_id', 0);
        $status = Input::get('status', 0);
        (new User())->where('user_id', '=', $user_id)->update(['status' => $status]);
        return Response::Success('操作成功',1);
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
        return Response::Success($list,1);
    }

    /**
     * 操作打款成功或者打款失败
     * @return string
     */
    public function DealPay(){
        $withdraw_id = Input::get('withdraw_id', 0);
        $status = Input::get('status',1);
        if (empty($withdraw_id)){
            return Response::Error('提现明细id不能为空');
        }
        $model = new Withdraw();
        $info = $model->where('withdraw_id', '=', $withdraw_id)->first()->toArray();
        if (empty($info)){
            return Response::Error('提现信息不存在');
        }
        try{
            \DB::beginTransaction();
            session_start();
            if ($status == 2){
                //付款成功
                //修改用户的可提现金额
                $user_model = new User();
                $user_info = $user_model->where('user_id', $info['user_id'])->first()->toArray();
                if ($user_info['money'] < $info['money']){
                    return Response::Error('打款金额超过用户的可提现金额',1);
                }
                $user_model->where('user_id', $info['user_id'])->update(['money' => $user_info['money'] - $info['money']]);
                $model->where('withdraw_id', $withdraw_id)->update(['status' => $status,'admin_id' => $_SESSION['admin_id'],'admin_name' => $_SESSION['admin_name'],'updated_at' => date('Y-m-d H:i:s')]);
            }
            if ($status == 3){
                //打款失败
                $model->where('withdraw_id', $withdraw_id)->update(['status' => $status,'admin_id' => $_SESSION['admin_id'],'admin_name' => $_SESSION['admin_name'], 'updated_at' => date('Y-m-d H:i:s')]);
            }
            \DB::commit();
            return Response::Success('操作成功',1);
        }catch (\Exception $e){
            \DB::rollBack();
            return Response::Error('操作失败',1);
        }
    }
}