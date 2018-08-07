<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'message';
    public  $timestamps = false;
    protected $fillable = array('user_id', 'type','phone','code','expire_minutes','check_times','status','created_at','updated_at');
}
