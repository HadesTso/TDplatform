<?php

namespace App\Libray;

class Response
{
    const ErrorType = 10900;
    const SuccessType = 200;
    const Success_No_Data = 10205;
    const NotLoginType = 20001;
    const TokenErrorType = 2;

    static public function Success($Data = [], $is_admin = 0)
    {
        if ($is_admin) {
            $Res = [
                'state' => [
                    'code' => self::SuccessType,
                    'msg' => 'trans("ResponseMsg.Success")'
                ],
                'data' => $Data
            ];
        }else{
            $Res = [
                'code' => self::SuccessType,
                'msg'   => trans("ResponseMsg.Success"),
                'data'  => $Data
            ];
        }

        return json_encode($Res);
    }

    static public function Success_No_Data($msg, $is_admin = 0)
    {
        if ($is_admin) {
            $Res = [
                'state' => [
                    'code' => self::SuccessType,
                    'msg' => $msg ? $msg : trans("ResponseMsg.Success")
                ]
            ];
        }else {
            $Res = [
                'code' => self::SuccessType,
                'msg' => $msg ? $msg : trans("ResponseMsg.Success"),
            ];
        }
        return json_encode($Res);
    }

    static public function NotLogin($Data = [], $is_admin = 0)
    {
        if ($is_admin) {
            $Res = [
                'state' => [
                    'code' => self::NotLoginType,
                    'msg' => trans("ResponseMsg.NotLogin")
                ],
                'data' => $Data
            ];
        }else {
            $Res = [
                'code' => self::NotLoginType,
                'msg' => trans("ResponseMsg.NotLogin"),
                'data' => $Data
            ];
        }

        return json_encode($Res);
    }


    static public function Error($Msg = '',$is_admin = 0,$Data = [])
    {
        if ($is_admin) {
            $Res = [
                'state' => [
                    'code' => self::ErrorType,
                    'msg' => $Msg ? $Msg : trans("ResponseMsg.Error"),
                ],
                'data' => $Data
            ];
        }else {
            $Res = [
                'code' => self::ErrorType,
                'msg' => $Msg ? $Msg : trans("ResponseMsg.Error"),
                'data' => $Data
            ];
        }

        return json_encode($Res);
    }


    static public function TokenError($Msg = '',$is_admin,$Data = [])
    {
        if ($is_admin) {
            $Res = [
                'state' => [
                    'code' => self::TokenErrorType,
                    'msg' => $Msg ? $Msg : trans("ResponseMsg.Error"),
                ],
                'data' => $Data
            ];
        }else {
            $Res = [
                'code' => self::TokenErrorType,
                'msg' => $Msg ? $Msg : trans("ResponseMsg.Error"),
                'data' => $Data
            ];
        }

        return json_encode($Res);
    }
}