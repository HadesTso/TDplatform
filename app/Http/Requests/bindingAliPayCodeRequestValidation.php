<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class bindingAliPayCodeRequestValidation extends BaseRequestValidator
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'phone' => 'required|regex:/^1[345678][0-9]{9}$/',
        ];
    }
}
