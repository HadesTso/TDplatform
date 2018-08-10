<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Withdraw extends Model
{
    protected $table = 'withdraw';
    public  $timestamps = false;
    protected $fillable = array('user_id','money','status','note');
}