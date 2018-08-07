<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted'             => ':attribute 必须是yes、on、1或true',
    'active_url'           => ':attribute 必须是正确的URL',
    'after'                => ':attribute 必须是一个在 :date 之后的日期',
    'after_or_equal'       => ':attribute 必须是大于或等于 :date 的日期',
    'alpha'                => ':attribute 必须是字母',
    'alpha_dash'           => ':attribute 只能包含字母和数字，以及破折号和下划线',
    'alpha_num'            => ':attribute 必须是字母或数字',
    'array'                => ':attribute 必须是 PHP 数组',
    'before'               => ':attribute 必须是 :date 之前的一个日期',
    'before_or_equal'      => ':attribute 必须是小于或等于 :date 的日期',
    'between'              => [
        'numeric' => ':attribute 必须在 :min 和 :max 数值之间',
        'file'    => ':attribute 必须在 :min and :max 之间',
        'string'  => ':attribute 必须在 :min and :max 字符串长度之间',
        'array'   => ':attribute 必须在 :min and :max 数组之间',
    ],
    'boolean'              => ':attribute 必须可以被转化为布尔值',
    'confirmed'            => ':attribute 必须有一个匹配字段confirmation',
    'date'                 => ':attribute 必须是一个基于 PHP strtotime 函数的有效日期',
    'date_format'          => ':attribute 必须是函数date 或 date_format 验证该字段',
    'different'            => ':attribute 和 :other 必须是一个和指定字段不同的值',
    'digits'               => ':attribute 必须是数字且长度为 :digits ',
    'digits_between'       => ':attribute 数值长度必须介于 :min 和 :max 之间',
    'dimensions'           => ':attribute 图片尺寸必须满足该规定参数指定的约束条件',
    'distinct'             => ':attribute 数组不能包含重复值',
    'email'                => ':attribute 必须是格式化的电子邮件地址',
    'exists'               => ':attribute 必须存在于指定数据表',
    'file'                 => ':attribute 必须是上传成功的文件',
    'filled'               => ':attribute 如果存在则不能为空。',
    'image'                => ':attribute 必须是图片（jpeg、png、bmp、gif或者svg）',
    'in'                   => ':attribute 必须在给定的列表中',
    'in_array'             => ':attribute 必须在 :other 字段值中存在',
    'integer'              => ':attribute 必须是整数',
    'ip'                   => ':attribute 必须是IP地址',
    'json'                 => ':attribute 必须是有效的JSON字符串',
    'max'                  => [
        'numeric' => ':attribute 必须小于等于 :max',
        'file'    => ':attribute 必须小于等于 :max kb',
        'string'  => ':attribute 必须小于等于 :max 个字符',
        'array'   => ':attribute 必须小于等于 :max 数组长度',
    ],
    'mimes'                => ':attribute 必须匹配给定的MIME文件类型之一 :values.',
    'mimetypes'            => ':attribute 必须匹配给定的MIME文件类型之一 :values.',
    'min'                  => [
        'numeric' => ':attribute 必须大于等于 :min.',
        'file'    => ':attribute 必须大于等于 :min kb',
        'string'  => ':attribute 必须大于等于 :min 个字符',
        'array'   => ':attribute 必须大于等于 :min 数组长度',
    ],
    'not_in'               => '该 :attribute 不能在给定列表中',
    'numeric'              => ':attribute 必须是数值',
    'present'              => ':attribute 必须出现在输入数据中但可以为空',
    'regex'                => ':attribute 必须匹配给定正则表达式',
    'required'             => ':attribute 不能为空',
    'required_if'          => '当 :other 等于 :value 时 :attribute 不能为空',
    'required_unless'      => ':attribute field is required unless :other is in :values.',
    'required_with'        => ':attribute field is required when :values is present.',
    'required_with_all'    => ':attribute field is required when :values is present.',
    'required_without'     => ':attribute field is required when :values is not present.',
    'required_without_all' => ':attribute field is required when none of :values are present.',
    'same'                 => ':attribute and :other must match.',
    'size'                 => [
        'numeric' => ':attribute 必须是 :size',
        'file'    => ':attribute 必须是 :size kb',
        'string'  => ':attribute 必须是 :size 个字符',
        'array'   => ':attribute 必须是 :size 数组长度',
    ],
    'string'               => ':attribute 必须是字符串',
    'timezone'             => ':attribute 必须是基于 PHP 函数timezone_identifiers_list的有效时区标识',
    'unique'               => ':attribute 在给定数据表上必须是唯一',
    'uploaded'             => ':attribute failed to upload.',
    'url'                  => ':attribute 必须是合法的URL',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | following language lines are used to swap attribute place-holders
    | with something more reader friendly such as E-Mail Address instead
    | of "email". This simply helps us make messages a little cleaner.
    |
    */

    'attributes' => [],

];
