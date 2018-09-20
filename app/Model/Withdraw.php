<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Withdraw extends Model
{
    protected $table = 'withdraw';
    protected $primaryKey = 'withdraw_id';
    public  $timestamps = false;
    protected $fillable = array('user_id','money','status','note');

    protected $dates = ['created_at', 'updated_at'];

    public function getList($where){
        $withdrawModel = \DB::table($this->table)
            ->leftJoin('user', 'user.user_id', '=', 'withdraw.user_id');
        if ($where){
            foreach ($where as $item){
                $withdrawModel->where($item[0], $item[1], $item[2]);
            }
        }
        return $withdrawModel->paginate(20)->toArray();
    }
}