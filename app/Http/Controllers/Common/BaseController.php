<?php
/**
 * Created by PhpStorm.
 * User: pro4
 * Date: 2017/10/26
 * Time: 19:55
 */

namespace App\Http\Controllers\Common;


use App\Http\Controllers\Controller;
use App\Libray\Response;
use Illuminate\Contracts\Validation\Validator;

class BaseController extends Controller
{
    protected function formatValidationErrors(Validator $validator)
    {
        $message = $validator->errors()->first();
        return [
            "Error" => 1,
            "Msg" => $message,
            "Data" => []
        ];
    }
}