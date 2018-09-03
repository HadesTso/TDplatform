<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $table = 'admin';
    protected $primaryKey = 'admin_id';
    public  $timestamps = false;
    protected $fillable = array('admin_id','admin_name','admin_mobile','password');
}