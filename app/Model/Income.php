<?php
/**
 * Created by PhpStorm.
 * User: cao
 * Date: 9/8/2018
 * Time: 4:00 PM
 */

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    protected $table = 'income';
    public  $timestamps = false;
    protected $fillable = array('user_id','money','app_id','app_name','created_at','updated_at');

}