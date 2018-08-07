<?php
/**
 * Created by PhpStorm.
 * User: cao
 * Date: 4/8/2018
 * Time: 3:45 PM
 */

namespace App\Libray;

class Response
{
    const ErrorType = 0;
    const SuccessType = 1;
    const TokenErrorType = 2;

    static public function Success($Data = [])
    {
        $Res = [
            'Error' => self::SuccessType,
            'Msg'   => trans("ResponseMsg.Success"),
            'Data'  => $Data
        ];

        return json_encode($Res);
    }


    static public function Erorr($Msg = '',$Data = [])
    {
        $Res = [
            'Error' => self::ErrorType,
            'Msg'   => $Msg?$Msg:trans("ResponseMsg.Error"),
            'Data'  => $Data
        ];

        return json_encode($Res);
    }


    static public function TokenError($Msg = '',$Data = [])
    {
        $Res = [
            'Error' => self::TokenErrorType,
            'Msg'   => $Msg?$Msg:trans("ResponseMsg.Error"),
            'Data'  => $Data
        ];

        return json_encode($Res);
    }
}