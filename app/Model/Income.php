<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    protected $table = 'income';
    public $timestamps = false;
    protected $fillable = array('user_id', 'money', 'app_id', 'app_name', 'created_at', 'updated_at');

}
