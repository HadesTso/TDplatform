<?php
/**
 * Created by PhpStorm.
 * User: 1
 * Date: 2018/8/13
 * Time: 1:07
 */

namespace App\Http\Controllers\Admin;


use App\Libray\Response;
use App\Model\Admin;
use App\Model\User;
use Illuminate\Support\Facades\Input;

class AdminController
{
    /**
     * 后台用户列表
     */
    public function index(){
        $name = Input::get('name', '');
        $model = new Admin();
        if ($name){
            $model->where('admin_name', 'like', '%'.$name.'%');
        }
        $list = $model->select('admin_name', 'admin_mobile', 'created_at','operator_name')->paginate(20)->toArray();
        $admin_user_count = (new Admin())->count();
        $list['admin_user_count'] = $admin_user_count;
        return Response::Success($list);
    }

    /**
     * 添加后台用户
     */
    public function add(){
        $name = Input::get('name','');
        $mobile = Input::get('mobile','');
        $password = Input::get('password', '');
        if (empty($name)){
            return Response::Error('用户账号不能为空');
        }
        $model = new Admin();
        session_start();
        $model->admin_name = $name;
        $model->admin_mobile = $mobile;
        $model->password = md5($password);
        $model->created_at = date('Y-m-d H:i:s');
        $model->updated_at = date('Y-m-d H:i:s');
        $model->operator_id = $_SESSION['admin_id'];
        $model->operator_name = $_SESSION['admin_name'];

        $res = $model->save();
        if ($res){
            return Response::Success('添加成功');
        }
        return Response::Error('添加失败');
    }

    /**
     * 修改用户状态
     */
    public function updateStatus(){
        $user_id = Input::get('admin_id', 0);
        $status = Input::get('status', 0);
        (new Admin())->where('admin_id', '=', $user_id)->update(['status' => $status]);
        return Response::Success('操作成功');
    }

}