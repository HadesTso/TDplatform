<?php
/**
 * Created by PhpStorm.
 * User: cao
 * Date: 7/8/2018
 * Time: 2:26 PM
 */

namespace App\Libray\Message;

use App\Libray\Message\CCPRestSmsSDK;
use App\Model\Message;

class sendSMS
{
    //主帐号,对应开官网发者主账号下的 ACCOUNT SID
    private $accountSid = '8aaf07085dcad420015ddfb6dde80581';

    //主帐号令牌,对应官网开发者主账号下的 AUTH TOKEN
    private $accountToken = '42e5cc87d5ad4589acdb5a119d1bf3db';

    //应用Id，在官网应用列表中点击应用，对应应用详情中的APP ID
    //在开发调试的时候，可以使用官网自动为您分配的测试Demo的APP ID
    private $appId ='8aaf07085dcad420015ddfb6de340585';

    //请求地址
    //沙盒环境（用于应用开发调试）：sandboxapp.cloopen.com
    //生产环境（用户应用上线使用）：app.cloopen.com
    private $serverIP ='app.cloopen.com';


    //请求端口，生产环境和沙盒环境一致
    private $serverPort ='8883';

    //REST版本号，在官网文档REST介绍中获得。
    private $softVersion ='2013-12-26';

    /**
     * 检测验证码是否正确
     * @param $phone string
     * @param $use_type integer
     *
     * @return bool
     */
    public function checkCode($phone, $code) {
        $m = Message::where('phone', $phone)->where([
            'type' => 1,
            'user_id' => 1
        ])->orderBy('id', 'DESC')->first();

        if (empty($m)) {
            return false;
        }

        // 最后一条是验证成功过的数据
        if ($m->status == 1) {
            return false;
        }

        // 判断验证码是否过期
        if (strtotime($m->created_at) + $m->expire_minutes * 60 < time()) {
            return false;
        }

        // 判断验证次数
        if ($m->check_times >= config('ali_message.max_check_times')) {
            return false;
        }

        // 验证码错误，验证次数+1
        if ($m->code != $code) {
            $m->check_times = $m->check_times + 1;
            $m->save();
            return false;
        }

        $m->status = 1;
        $m->save();
        return true;
    }


    /**
     * 发送绑定支付宝账号短信
     * @param $phone
     * @param $agent
     * @param $code
     *
     * @return bool
     */
    public function bindingAliPay($phone) {
        $code = mt_rand(100000, 999999);

        $param = [
            (string)$code,
            config('app.expire_minutes')
        ];

        // 发送短信
        $b = $this->sendTemplateSMS((string)$phone, $param);
        if (!$b) {
            return false;
        }

        // 记录数据库
        $m = new Message;
        $m->use_id = 1;
        $m->type = 1;
        $m->phone = $phone;
        $m->code = $code;
        $m->expire_minutes = config('app.expire_minutes');
        $m->save();

        return true;
    }


    /**
     * @param $to
     * @param $datas
     * @param int $tempId
     * @return bool
     */
    private function sendTemplateSMS($to,$datas,$tempId = 1)
    {
        // 初始化REST SDK
        $rest = new CCPRestSmsSDK($this->serverIP, $this->serverPort, $this->softVersion);
        $rest->setAccount($this->accountSid, $this->accountToken);
        $rest->setAppId($this->appId);

        // 发送模板短信
        echo "Sending TemplateSMS to $to <br/>";
        $result = $rest->sendTemplateSMS($to, $datas, $tempId);
        if ($result == NULL) {
            echo "result error!";
            return false;
        }
        if ($result->statusCode != 0) {
            echo "error code :" . $result->statusCode . "<br>";
            echo "error msg :" . $result->statusMsg . "<br>";
            //TODO 添加错误处理逻辑
        } else {
            echo "Sendind TemplateSMS success!<br/>";
            // 获取返回信息
            $smsmessage = $result->TemplateSMS;
            echo "dateCreated:" . $smsmessage->dateCreated . "<br/>";
            echo "smsMessageSid:" . $smsmessage->smsMessageSid . "<br/>";
            //TODO 添加成功处理逻辑
        }
    }
}