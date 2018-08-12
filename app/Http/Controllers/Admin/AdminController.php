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
        $list = $model->paginate(20)->toArray();
        return Response::Success($list);
    }

    /**
     * 添加后台用户
     */
    public function add(){
        $name = Input::get('name','');
        $password = Input::get('password', '');
        if (empty($name)){
            return Response::Error('用户账号不能为空');
        }
        $data = [
          'admin_name' => $name,
          'password' => md5($password),
          'password' => md5($password),
        ];
    }
}