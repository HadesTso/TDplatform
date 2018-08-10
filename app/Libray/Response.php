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
    const ErrorType = 10900;
    const SuccessType = 200;
    const TokenErrorType = 2;

    static public function Success($Data = [])
    {
        $Res = [
            'Code' => self::SuccessType,
            'Msg'   => trans("ResponseMsg.Success"),
            'Data'  => $Data
        ];

        return json_encode($Res);
    }


    static public function Error($Msg = '',$Data = [])
    {
        $Res = [
            'Code' => self::ErrorType,
            'Msg'   => $Msg?$Msg:trans("ResponseMsg.Error"),
            'Data'  => $Data
        ];

        return json_encode($Res);
    }


    static public function TokenError($Msg = '',$Data = [])
    {
        $Res = [
            'Code' => self::TokenErrorType,
            'Msg'   => $Msg?$Msg:trans("ResponseMsg.Error"),
            'Data'  => $Data
        ];

        return json_encode($Res);
    }
}