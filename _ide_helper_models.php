<?php
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App{
/**
 * App\User
 *
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection|\Illuminate\Notifications\DatabaseNotification[] $notifications
 */
	class User extends \Eloquent {}
}

namespace App\Model{
/**
 * App\Model\User
 *
 * @property int $user_id 用户id
 * @property string|null $openid 微信openid
 * @property string|null $head_img 用户头像
 * @property string|null $nickname 用户昵称
 * @property float|null $money 可提现金额
 * @property string|null $alipay 支付宝账号
 * @property string|null $alipay_name 支付宝昵称
 * @property float|null $cumulative_amount 累计金额
 * @property string|null $mobile 用户手机号
 * @property string|null $type 用户类型（安卓为1，苹果为2）
 * @property string|null $is_binding 是否绑定提现账号
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\User whereAlipay($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\User whereAlipayName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\User whereCumulativeAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\User whereHeadImg($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\User whereIsBinding($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\User whereMobile($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\User whereMoney($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\User whereNickname($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\User whereOpenid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\User whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\User whereUserId($value)
 */
	class User extends \Eloquent {}
}

namespace App\Model{
/**
 * App\Model\Message
 *
 * @property int $id
 * @property int|null $user_id 用户id
 * @property int $type 1绑定支付宝
 * @property string $phone 手机号
 * @property string $code 验证码
 * @property int $expire_minutes 过期分钟数
 * @property int $check_times 验证次数
 * @property int $status 0无状态，1成功
 * @property string $created_at
 * @property string $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\Message whereCheckTimes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\Message whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\Message whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\Message whereExpireMinutes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\Message whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\Message wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\Message whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\Message whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\Message whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Model\Message whereUserId($value)
 */
	class Message extends \Eloquent {}
}

