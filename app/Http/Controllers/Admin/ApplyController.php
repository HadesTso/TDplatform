<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Libray\Response;
use App\Model\Apply;
use App\Model\Income;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

/**
 * 后端应用控制器
 * Class ApplyController
 * @package App\Http\Controllers\Admin
 */
class ApplyController extends Controller
{
    protected $exts = ['jpg','jpeg','png','gif'];
    /**
     * 应用列表
     * @return string
     */
    public function index(Income $incomeModel, Request $request, Apply $applyModel){
        $type = $request->input('type', 0);
        $name = $request->input('name', '');
        $start_time = $request->input('start_time', '');
        $end_time = $request->input('end_time', date('Y-m-d'));
        $status = $request->input('status', null);
        $model = $applyModel->where('type', '=', $type);
        if ($name){
            $model->where('name', 'like', '%'.$name.'%');
        }
        if ($start_time){
            $model->where('created_at', '>', $start_time.' 00:00:00');
            $model->where('created_at', '<', $end_time.' 23:59:59');
        }
        if ($status === '0' || $status === '1'){
            $model->where('status', $status);
        }
        $list = $model->paginate(20)->toArray();
        $rewards = 0;
        $get_reward_count = 0;
        foreach($list['data'] as &$value){
            $spread_num = $incomeModel->where([
                'app_id' => $value['app_id']
            ])->count();
            $value['spread_num'] = $spread_num.'/'.$value['num'];
            $value['get_reward'] = $spread_num * $value['money'];
            $rewards += $value['money'] * $value['num'];
            $get_reward_count += $value['get_reward'];
        }
        $list['rewards'] = $rewards;
        $list['get_reward_count'] = $get_reward_count;
        $list['ios_count'] = $applyModel->where('type',1)->count();
        $list['android_count'] = $applyModel->where('type',0)->count();
        return Response::Success($list,1);
    }

    /**
     * 添加应用
     */
    public function add(Request $request){
        $name = Input::get('name', '');
        $logo = $request->input('logo');
        $type = Input::get('type', '');
        $money = Input::get('money', 0);
        $num = Input::get('num', 0);
        $rank = Input::get('rank', 0);
        $note = Input::get('note', '');
        $pack_name = Input::get('pack_name', '');
        $urlscheme = Input::get('urlscheme', '');
        if (empty($name)){
            return Response::Error('应用名不能为空',1);
        }
        if (empty($logo)){
            return Response::Error('应用logo不能为空',1);
        }
        if (empty($num)){
            return Response::Error('应用分数不能为空',1);
        }
        $model = new Apply();
        //包名不能重复
        $is_exit = $model->where('pack_name','like', '%'.$pack_name.'%')->where('type', '=', $type)->first();
        if ($is_exit){
            return Response::Error('包名已经存在，请重新输入',1);
        }
        try{
            $logo = $this->add_img($logo);
            if (!$logo){
                return Response::Error('上传logo失败',1);
            }

            $data = [
                'name' => $name,
                'rank' => $rank,
                'note' => $note,
                'money' => $money,
                'pack_name' => $pack_name,
                'logo' => $logo,
                'type' => $type,
                'status' => 1,
                'urlscheme' => $urlscheme,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            $res = $model->insert($data);
            if ($res){
                return Response::Success('添加成功',1);
            }else{
                return Response::Error('保存失败',1);
            }
        }catch (\Exception $exception){
            return response(Response::Error('新增失败',1));
        }
    }

    /**
     * 上传图片
     * @param $img
     * @return bool|string
     */
    protected function uploadImg($img)
    {

        if(!($img -> isValid())){
            return false;
        }
        $filedir = "/logoImg/"; //定义图片上传路径
        $imagesName = $img->getClientOriginalName(); //获取上传图片的文件名
        $extension = $img->getClientOriginalExtension(); //获取上传图片的后缀名
        $fileName = md5(uniqid($imagesName));
        $fileName = $fileName . '.' . $extension;//生成新的的文件名
        $bool = \Storage::disk('logo')->put($fileName, file_get_contents($img->getRealPath()));//
        $url = $_SERVER['SERVER_NAME'] . $filedir . $fileName;//返回文件路径存贮在数据库
        if (!$bool) {
            return false;
        } else {
            return $url;
        }
    }

    protected function add_img($img){
        //文件夹日期
        $ymd = date("Ymd");

        //图片路径地址
        $basedir = 'upload/base64/'.$ymd.'';
        $fullpath = $basedir;
        if(!is_dir($fullpath)){
            mkdir($fullpath,0777,true);
        }
        $types = empty($types)? array('jpg', 'gif', 'png', 'jpeg'):$types;

        $img = str_replace(array('_','-'), array('/','+'), $img);

        $b64img = substr($img, 0,100);

        if(preg_match('/^(data:\s*image\/(\w+);base64,)/', $b64img, $matches)){

            $type = $matches[2];
            if(!in_array($type, $types)){
                $arr= array('status'=>1,'info'=>'图片格式不正确，只支持 jpg、gif、png、jpeg哦！','url'=>'');
                return $arr;
            }
            $img = str_replace($matches[1], '', $img);
            $img = base64_decode($img);
            $photo = '/'.md5(date('YmdHis').rand(1000, 9999)).'.'.$type;
            file_put_contents($fullpath.$photo, $img);

            $url = env('APP_URL').$basedir.$photo;

        }
        return $url;
    }
}