<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Withdraw extends Model
{
    protected $table = 'withdraw';
    protected $primaryKey = 'withdraw_id';
    public  $timestamps = false;
    protected $fillable = array('user_id','money','status','note');

    public function getList($where){
        $model = \DB::table($this->table)
            ->leftJoin('user', 'user.user_id', '=', 'withdraw.user_id');
        if ($where){
            foreach ($where as $item){
                $model->where($item[0], $item[1], $item[2]);
            }
        }
        return $model->paginate(20)->toArray();
    }
}