<?php
/**
 * Created by PhpStorm.
 * User: cao
 * Date: 6/8/2018
 * Time: 11:12 AM
 */

return [
    "Success" => "请求成功",
    "Error" => "请求失败",
    "AccessDenied" => '无访问权限',
    "Order" => [
        "SaveError" => "记录订单失败",
        "OrderListEmpty" => "订单列表为空",
        "OrderListEnd" => "订单列表已经到底",
        "TransferLimit" => "单笔提现限额1-2000元",
        "CreateTransferFail" => "创建转账订单失败",
        "TransferFail"  => "微信提现失败",
        'MoneyNotEnough' => '余额不足以提现',
        'Missing' => "订单不存在",
        'ParamsError' => '订单参数错误'
    ],
    "Device" => [
        "DeviceMissing" => "设备不存在",
        "DeviceStop" => "设备已停用云投币功能",
        "DevicePasswordError" => "设备开通密码错误",
        "DeviceBindRepeat" => "设备已被绑定，不可再次绑定!",
        "DeviceOffline" => "设备暂时无法使用，请稍后再试!",
        "DeviceNOException"  => "设备号异常",
        "DeviceNotBind" => "设备未绑定，无法使用"
    ],
    "EditDeviceTemplate" => [
        'Alias'  => '设备别名不合法',
        'DefaultPay'  => '消费金额不合法',
        'Type'  => '类型不合法',
        'Status'  => '状态不合法',
        'ComboJson'  => '套餐内容不合法',
        'TemplateNoExist'  => '设备模板不存在',
        'TemplateSaveFalse'  => '模板保存失败',
    ],
    "BankCard" => [
        "BankNameMissing"           =>  "银行名称不能为空",
        "BankCardIdMissing"         =>  "银行卡不能为空",
        "BankUserIdMissing"         =>  "身份证号不能为空",
        "BankUserIdNameMissing"     =>  "身份证名称不能为空",
        "BankCardCodeMissing"       =>  "银行编号不能为空",
        "BankCardIdError"           =>  "银行卡号错误",
        "BankCardCodeError"         =>  "银行编号错误",
        "BankUserIdError"           =>  "身份证号错误",
        "CreateCardError"           =>  "添加银行卡失败，请重试",
        "DeleteCardError"           =>  "删除银行卡失败",
        "EditCardError"             =>  "编辑银行卡失败",
        "EditCardParamsError"       =>  "编辑银行卡参数错误",
        "UserCardListEmpty"         =>  "银行卡列表为空",
        "UserCardListError"         =>  "获取列表错误",
    ],
    "User" => [
        "Missing" => "用户不存在",
        "Repeat" => "用户已经存在",
        "RepeatUserName" => "用户名重复",
        "RepeatPhone" => "手机号已经被注册过了",
        "AgentPhoneError"   => "服务商手机号错误",
        "UpdatePaymentTypeError" => "修改的提现方式不正确",
        "FileTypeError"=>"文件类型错误,只能上传图片",
        "Register" => [
            "Success" => "注册成功",
            "Fail" => "注册失败",
            "IsAgent" => "该微信号已经绑定为服务商，不可再次绑定为商户",
            "IsSeller" => "该微信号已经绑定为商户，不可再次绑定为服务商",
            "Code" => "短信验证码错误！",
        ],
        "Login" => [
            "PasswordError" => "密码错误",
            "IsAgent" => "该账号为服务商，不可用于登录商户中心"
        ],
        "Token" => [
            "TokenError" => "token错误",
            "TokenNotFound" => "token不存在"
        ],
        "Withdraw"  =>  [
            "TypeMissing"   =>  "提现方式不能为空",
            "TypeError"     =>  "提现方式错误",
            "IDMissing"     =>  "提现id不能为空",
            "IDError"       =>  "提现id错误",
            "SettingError"  =>  "提现设置错误",
            "WaitingSetting"=>  "等待设置提现方式",
            'WaitingReview' => '提现申请已发出，等待平台审核',
            'WaitingSuccess' => '提现申请已发出，约5分钟后到账'
        ],
        "Wechat" => [
            "NotBinding" => "该账号尚未绑定微信，无法提现， 请前往个人中心绑定微信",
            "AccountRepeatBinding" => "该账号已经绑定微信,无法再次绑定其他微信，如要解绑，请联系麦宝工作人员!",
            "WechatRepeatBinding" => "该微信号已经绑定其他账号，请更换微信绑定",
            'AuthError' => '微信授权错误，请重新授权'
        ],
        "Agent" => [
            "Custom" => "请完善所有代理商数据",
            "ImageUploadError" => "图片上传失败",
        ],
        "Seller" => [
            "Custom" => "请完善所有数据",
            "Missing" => "商户不存在"
        ],
        "AgentLogin" => [
            "Username" => "请输入帐号",
            "Password" => "请输入密码",
            "UsernameMin" => "帐号必须大于6位",
            "PasswordMin" => "密码必须大于6位",
            "Error" => "帐号或密码错误",
            "NoAuth" => "无权限",
        ],

    ],
    "Company"   =>  [
        "CompanyNameMissing"    =>  "企业名称不能为空",
        "CompanyNOMissing"      =>  "企业营业执照编号不能为空",
        "LeagalNameMissing"     =>  "法人名称不能为空",
        "LeagalIDMissing"       =>  "法人身份证编号不能为空",
        "LicenceImageMissing"   =>  "营业执照照片不能为空",
        "TaxImageMissing"       =>  "税务登记照片不能为空",
        "AccountImageMissing"   =>  "开户许可证照片不能为空",
        "OrganizationImageMissing"  =>  "组织机构代码照片不能为空",
        "RevenueImageMissing"   =>  "进账账户图片不能为空",
        "IdcardFrontImageMissing"   =>  "身份证正面照片不能为空",
        "IdcardBackImageMissing"    =>  "身份证反面照片不能为空",
        "OfficeImageMissing"    =>  "办公室照片不能为空",
        "DoorImageMissing"      =>  "门口照片不能为空",
        "DownstageImageMissing" =>  "前台照片不能为空",
        "Indoor1ImageMissing"   =>  "室内照片1不能为空",
        "Indoor2ImageMissing"   =>  "室内照片2不能为空",
        "UploadImageMissing"    =>  "上传图片不能为空",
        "UploadImageTypeMissing"    =>  "上传图片类型不能为空",
        "UploadImageTypeError"  =>  "上传图片类型错误",

    ],
    "Pay" => [
        "insufficientInAmount" => "支付金额不能小于:Param元"
    ],
    'Common' => [
        'PhoneFormatError' => '手机号格式错误'
    ]
];