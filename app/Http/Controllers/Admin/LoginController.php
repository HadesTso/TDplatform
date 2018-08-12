<?php


namespace App\Http\Controllers\Admin;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $admin_name = $request->input("admin_name");
        $password = $request->input('password');

        $admin= Admin::where([
            'admin_name' => $admin_name,
            'password' => md5($password)
        ])->first();

        if (empty($admin)) {
            return response(Response::Error('帐号或密码错误'));
        }

        $Token = $this->setLoginInfo($admin);
        $data = [
            'token' => $Token,
            'admin_name' => $admin->admin_name,
            'admin_id' => $admin->admin_id,
        ];
        return response(Response::Success($data));

    }

    protected function setLoginInfo($admin){
        $Token = [
            'admin_id'  => $admin->admin_id,
            'admin_mobile' => $admin->admin_mobile,
            'time'    => time(),
        ];

        $Encryption = new Encryption();
        $Token = $Encryption->encode(json_encode($Token));

        session()->put($Token,time(),86400);
        return ['Token' => $Token];
    }
}