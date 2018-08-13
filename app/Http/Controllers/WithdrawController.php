<?php

namespace App\Http\Controllers;

use App\Libray\Response;
use App\Model\Income;
use App\Model\Withdraw;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Model\User;
use App\Model\Apply;

class WithdrawController extends Controller
{
    public function withdraw(Request $request, User $userModel, Withdraw $withdrawModel)
    {
        $money = $request->input('money');

        $userInfo = $userModel->where([
            'user_id' => 1
        ])->select('money')
          ->first();

        if ($userInfo->money < $money){
            return response(Response::Error('超过可提现金额'));
        }

        DB::beginTransaction();
        try{
            $withdrawModel->user_id = 1;
            $withdrawModel->money = $money;
            $withdrawModel->status = 1;
            $withdrawModel->created_at = date('Y-m-d H:i:s',time());
            $withdrawModel->updated_at = date('Y-m-d H:i:s',time());
            $withdrawModel->save();
            $userModel->where([
                'user_id' => 1
            ])->update([
                'money' => ($userInfo->money - $money)
            ]);
            DB::commit();
            return response(Response::Success_No_Data('提现申请成功'));
        }catch (\Exception $exception){
            DB::rollBack();
            return response(Response::Error('提现申请失败'));
        }
    }

    public function withdrawList(Withdraw $withdrawModel)
    {
        $withdrawlist = $withdrawModel->where([
            'user_id' => 1
        ])->select('withdraw_id','user_id','money','status','note', 'created_at')
          ->paginate(10)->toArray();

        return response(Response::Success($withdrawlist));
    }

    /**
     * 收入明细
     * @param Request $request
     * @param User $userModel
     * @param Income $incomeModel
     */
    public function incomeList(Request $request, User $userModel, Income $incomeModel){
        $user_id = 1;
        $list = $incomeModel
            ->where(['user_id' => $user_id])
            ->select('income_id', 'app_name', 'app_logo', 'money', 'created_at')
            ->paginate(10)->toArray();
        $user_info = $userModel->where('user_id', $user_id)->first(['cumulative_amount']);
        $list['cumulative_amount'] = $user_info['cumulative_amount'];
        return response(Response::Success($list));
    }


    public function incomeReceive(Request $request, Income $incomeModel, Apply $applyModel, User $userModel)
    {
        $app_id = $request->input('app_id');

        $apply = $applyModel->where('app_id',$app_id)->first();

        if (!$apply){
            return response(Response::Error('该应用不存在'));
        }
        DB::beginTransaction();
        try{
            $incomeModel->user_id = 1;
            $incomeModel->money = $apply->money;
            $incomeModel->app_id = $app_id;
            $incomeModel->app_logo = $apply->logo;
            $incomeModel->app_name = $apply->name;
            $incomeModel->created_at = date('Y-m-d H:i:s',time());
            $incomeModel->updated_at = date('Y-m-d H:i:s',time());

            $incomeModel->save();

            $user = $userModel->where('user_id',1)->first();
            $user->money += $apply->money;
            $user->cumulative_amount += $apply->money;

            $user->save();
            DB::commit();
            return response(Response::Success_No_Data('领取奖励成功'));
        }catch (\Exception $exception){
            DB::rollBack();
            return response(Response::Error('领取奖励失败'));
        }

    }
}