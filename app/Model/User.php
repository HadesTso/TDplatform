<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'user';
    protected $fillable = ['openid', 'head_img','nickname','money','alipay','alipay_name','cumulative_amount','mobile','type'];
}
