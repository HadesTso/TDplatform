<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Apply extends Model
{
    protected $table = 'apply';
    public  $timestamps = false;
    protected $fillable = array('name','logo','type','mone','num','status','urlscheme');
}
