<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Libray\Response;
use App\Model\Apply;
use Illuminate\Support\Facades\Input;

/**
 * 后端应用控制器
 * Class ApplyController
 * @package App\Http\Controllers\Admin
 */
class ApplyController extends Controller
{
    public function index(){
        $type = Input::get('type', 0);
        $name = Input::get('name', '');
        $start_time = Input::get('start_time', '');
        $end_time = Input::get('end_time', date('Y-m-d'));
        $status = Input::get('status', '');
        $model = new Apply();
        $model->where('type', $type);
        if ($name){
            $model->where('name', 'like', '%'.$name.'%');
        }
        if ($start_time){
            $model->where('created_at', '>', $start_time.' 00:00:00');
            $model->where('created_at', '<', $end_time.' 23:59:59');
        }
        if ($status == 0 || $status == 1){
            $model->where('status', $status);
        }
        $list = $model->paginate(20)->toArray();
        return Response::Success($list);
    }
}