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
    protected $exts = ['jpg','jpeg','png','gif'];
    /**
     * 应用列表
     * @return string
     */
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

    /**
     * 添加应用
     */
    public function add(){
        $name = Input::get('name', '');
        $logo = Input::file('logo');
        $type = Input::get('type', '');
        $money = Input::get('money', 0);
        $num = Input::get('num', 0);
        $rank = Input::get('rank', 0);
        $note = Input::get('note', '');
        $pack_name = Input::get('pack_name', '');
        if (empty($name)){
            return Response::Error('应用名不能为空');
        }
        if (empty($logo)){
            return Response::Error('应用logo不能为空');
        }
        if (empty($num)){
            return Response::Error('应用分数不能为空');
        }
        try{
            $logo = $this->uploadImg($logo);
            if (!$logo){
                return Response::Error('上传logo失败');
            }
            $model = new Apply();
            $data = [
                'name' => $name,
                'rank' => $rank,
                'note' => $note,
                'money' => $money,
                'pack_name' => $pack_name,
                'logo' => $logo,
                'type' => $type,
                'status' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            $res = $model->insert($data);
            if ($res){
                return Response::Success('添加成功');
            }else{
                return Response::Error('保存失败');
            }
        }catch (\Exception $exception){
            return response(Response::Error('新增失败'));
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
}