<?php

namespace App\Http\Controllers;

use App\Model\Apply;
use App\Model\Income;
use App\Libray\Response;
use Illuminate\Http\Request;

class ApplyController extends Controller
{
    public function appList(Apply $applyModel, Income $incomeModel, Request $request)
    {
        $app_id = $request->input('app_id');

        $incomelist = $incomeModel->where([
            'user_id' => 1,
        ])->select('app_id')->get();

        $incomeArray = array();
        foreach ($incomelist as $key => $value){
            $incomeArray[] = $value->app_id;
        }


        $apply = $applyModel->where([
            'status' => 1
        ])->where('num','>',0)
          ->whereNotIn('app_id',$incomeArray)
          ->selet();

        if($app_id){
            $apply->where('app_id',$app_id);
        }

        $applist = $apply->get();

        return response(Response::Success($applist));
    }
}
