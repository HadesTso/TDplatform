<?php

namespace App\Http\Requests;

use App\Exceptions\RequestValidatorException;
use App\Http\Requests\Request;
use Illuminate\Contracts\Validation\Validator;

class BaseRequestValidator extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    protected function failedValidation(Validator $validator)
    {
        throw new RequestValidatorException($validator->getMessageBag()->first());
    }

    public function messages()
    {
        return [
            'required' => trans("HttpRequest.Error.ParamsMissing",["Param" => ":attribute"])
        ];
    }
}
