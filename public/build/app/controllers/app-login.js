$(function(){
    console.log("123")
    var $formLogin = $('#formLogin'),
        $loginBtn = $('#loginBtn'),
        $loginMobile = $('#loginMobile'),
        $loginPassword = $('#loginPassword'),
        $getCodeBtn = $('#getCodeBtn'),
        $loading = $('#loading'),
        isLoading = false;
    var test = function(isIgnoreTest) {
        var r = '';
        var path = window.location.pathname;
        if(!isIgnoreTest && path.indexOf('/test') >= 0) {
            r = '/test';
        }
        return r;
    };
    var isMobile = function (val) {
        var rgx = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i;
        return rgx.test($.trim(val));
    };

    var doLogin = function(cb, cberr){ //请求接口
        var url = test() + '/admin/auth';
        if(vd() && !isLoading) {
            toggleLoading(); // 开始loading

            $.post(url, {
                'admin_name': $loginMobile.val(),
                'password': $loginPassword.val()
            }).done(function(data) {
                console.log("666")
                if(typeof cb === 'function') {
                    cb(data);
                }
            }).fail(function(data) {
                console.log("666")
                if(typeof cberr === 'function') {
                    cberr(data);
                }
            }).always(function(){
                toggleLoading(); // 隐藏loading
            });    
        }
    },
    vd = function(){ // 验证
        var result = true;
        if($.trim($loginMobile.val()) === '') {
            result = false;
            alert('请输入手机号码');
            return result;
        }
        if(!isMobile($loginMobile.val())) {
            result = false;
            alert('请输入正确的手机号码');
            return result;
        }
        if($.trim($loginPassword.val()) === '') {
            result = false;
            alert('请输入密码');
            return result;
        }
        //if($.trim($loginPassword.val()).length != 6) {
        //    result = false;
        //    alert('请输入正确的密码');
        //    return result;
        //}
        return result;
    };
    var toggleLoading = function(){
        $loading.toggleClass('on');
        isLoading = !isLoading;
        $loginBtn.toggleClass('disabled');
    };
    var loginHandler = function(e) {
        var successCb = function(data) {
                console.log("登录成功")
            //var successUrl = test() + '/acjl-admin/index'; // 登录成功后跳转
            var successUrl = 'www.baidu.com'; // 登录成功后跳转

            if(data.state && data.state.code && data.state.code === 10200) {
                localStorage.setItem('kojiadmin-user', JSON.stringify(data));
                window.location.href = successUrl;
            }else {
                if(data.state && data.state.msg) {
                    alert(data.state.msg);
                }
            }
        },
        failureCb = function(data) {
            console.log("登录失败")
            if(data && data.state && data.state.msg) {
                alert(data.state.msg);
            }
        };
        doLogin(successCb, failureCb);
    },
    keyHandler = function(e) {
        var keyCode = e.keyCode;
        if(keyCode === 13){
            loginHandler(e);
        }
    };

    $loginBtn.click(loginHandler);
    $loginMobile.keyup(keyHandler);
    $loginPassword.keyup(keyHandler);

    // 获取手机验证码
    var leftSecond = 60,
        timer = null;
    var getCode = function(opt, cb, cberr) {
        var url = test() + '/send-msg';
        $.post(url, opt).done(cb).fail(cberr);
    },
    getCodeHandler = function(data) {
        if(data && data.state && data.state.code == 10200) {
            $getCodeBtn.attr('disabled', true);
            doCountdonw();
        }
    },
    doCountdonw = function() {
        leftSecond--;
        if(leftSecond < 0) {
            $getCodeBtn.attr('disabled', false).text('获取验证码');
            clearTimeout(timer);
            leftSecond = 60;
        }else {
            $getCodeBtn.text(leftSecond + 's');
            timer = setTimeout(function() {
                doCountdonw();
            }, 1000);
        }
    };

    $getCodeBtn.click(function() {
        if($.trim($loginMobile.val()) === '') {
            alert('请输入手机号码');
            return;
        }
        if(!isMobile($loginMobile.val())) {
            alert('请输入正确的手机号码');
            return;
        }
        getCode({
            mobile: $loginMobile.val(),
            type: 1
        }, getCodeHandler);
    });
    
});