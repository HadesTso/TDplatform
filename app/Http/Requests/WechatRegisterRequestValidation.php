<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WechatRegisterRequestValidation extends BaseRequestValidator
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'code' => 'required'
        ];
    }
}