/**
 * Created by Administrator on 2018/8/18.
 */
(function() {
    var vm = new Vue({
        el:'#smdfqr',
        data: {
            msg: '111111',
            loading:false,
            urlStatus:'',//获取链接上的参数
            list:[],
            isShowLayer:false,//弹框显示
            urlscheme:'',//app的打开链接
            step1done:0,//是否完成第一步
            step2done:0,//是否完成第二步
            showTip:false,//是否展示
            ajaxParams:{
                page:'1',//页码
                //status:'',//状态
                //search:'',//搜索
            },
            page:'',//保存分页数据
        },
        methods:{
            autoLogin: function(opt, cb, cberr) {
                var that = this;
                var url = '/auto/login';
                that.$httpGet(url, opt)
                    .then(cb, cberr);
            },
            autoLoginHandler: function (data) {

            },
            getAppDetail: function(opt, cb, cberr) {
                var that = this;
                var url = '/app/list';
                that.$httpGet(url, opt)
                    .then(cb, cberr);
            },
            getAppDetailHandler: function (data) {
                var that = this;
                that.loading = false;
                that.ajaxParams.search = '';
                if(data && data.code === 200) {
                    //that.list.push(...data.data.data);
                    that.page = data.data;
                    that.urlscheme = data.data.urlscheme;
                    console.log(that.page.logo)
                    $('.appLogo').attr('src',that.page.logo)
                    //for(var i=0;i<data.data.data.length;i++){
                    //    var a = data.data.data[i].mobile.slice(0,3);
                    //    var b = data.data.data[i].mobile.slice(7,11);
                    //    that.list[i].mobile = a + '****' +b;
                    //
                    //}
                    //配置页码
                    //that.pageConfig.page = data.data.currentPage;
                    //that.pageConfig.lastPage = data.data.lastPage;
                }
            },
            receiveReward: function(opt, cb, cberr) {
                var that = this;
                var url = '/income/receive';
                that.$httpPost(url, opt)
                    .then(cb, cberr);
            },
            receiveRewardHandler: function (data) {
                var that = this;
                console.log(data)
                that.loading = false;
                if(data && data.code === 200) {
                    that.$myalert(data.msg)
                    //that.list.push(...data.data.data);
                    //that.page = data.data
                    window.location.href="qianjinbao://";
                    $(".layer").css("display","none");
                }else{
                    that.$myalert(data.msg)
                }
            },
            backLayer: function () {
                var that = this;
                console.log(3)
                $(".bigPic").css('display','none')
                $(".deleteImg").css('display','none')
                $(".submit1").css('display','block')

                $(".back1").css("display","none");
                $(".back2").css("display","block");
                $(".back3").css("display","none");
                $('#titlebarText').text('签约确认')
            },
            closeWindow: function(){
                //返回APP首页
                bridge.invoking('showJianFangAppComponent',{
                    name: 'close_window',
                });
            },
            testApp1: function (rul) {
                var that = this;
                //判断时Android还时iOS

                function android(){
                    window.location.href = "mqqapi://"; /***打开app的协议，有安卓同事提供***/
                    window.setTimeout(function(){
                        window.location.href = "http://www.wjtr.com/download/index.html"; /***打开app的协议，有安卓同事提供***/
                    },2000);
                };
                function ios(){
                    var ifr = document.createElement("iframe");
                    //ifr.src = "openwjtr://com.tyrbl.wjtr"; /***打开app的协议，有ios同事提供***/
                    //ifr.src = "openwjtr://com.from.CarServiceDemo"; /***打开app的协议，有ios同事提供***/
                    ifr.src = "weixin://"; /***打开QQ app的协议，有ios同事提供***/
                    ifr.style.display = "none";
                    document.body.appendChild(ifr);
                    window.setTimeout(function(){
                        document.body.removeChild(ifr);
                        window.location.href = "http:baidu.html"; /***下载app的地址***/
                    },2000)
                };
                if(that.isAndroid){
                    android()
                }
                if(that.isiOS){
                    ios()
                }
        },
            testApp2: function () {
            var that = this;
            //判断时Android还时iOS
            console.log(that.isAndroid);
            console.log(that.isiOS);

            if(that.isiOS){
                //if ([[UIApplication sharedApplication] canOpenURL:[NSURL  URLWithString:@"mqq://"]]){
                //    NSLog(@"install--");
                //}else{
                //    NSLog(@"no---");
                //}
                alert('IOS')
            }else if(that.isAndroid){
                alert('androad')
            }else{
                alert('未检测到')
            }
        },
            goback: function () {
                var that = this;
                setTimeout(function () {
                    console.log(1)
                    $('.tip').css('opacity',1)
                },100)
                that.showTip = true;
            },
            tipsure: function () {
                var that = this;
                that.showTip = false;
                window.location.href="qianjinbao://";
            },
            tipcancle: function () {
                var that = this;
                that.showTip = false;
            },
            goDownload: function () {
                var that = this;
                if(that.ajaxParams.status == 1){//已经下载该应用
                    that.$myalert('当前设备已安装此应用，无法完成此任务')
                    return false;
                }
                window.location.href="itms-apps://itunes.apple.com/";
                that.step1done = 1;
            },
            openApp: function () {
                var that = this;

                var loadDateTime = +new Date();
                window.setTimeout(function() {
                    const timeOutDateTime = +new Date();
                    if ((timeOutDateTime - loadDateTime) < 5000) {
                        alert('请完成第一步!')
//                        window.location.href = 'itms-apps://itunes.apple.com/'; // ios下载地址
                    } else {
                        window.close();
                    }
                }, 2000);
                //window.location.href = 'weixin://'; // ios对应的app协议

                window.location.href = that.urlscheme;
                that.step2done = 1;
            },
            getReward: function () {
                var that = this;
                if(that.ajaxParams.status!=1){
                    that.$myalert('当前设备已安装此应用，无法完成此任务')
                    return false;
                }
                if(that.step1done==0){
                    that.$myalert('请先完成第1步哦')
                    return false;
                }
                if(that.step2done==0){
                    that.$myalert('请先完成第2步哦')
                    return false;
                }
                var postData = {}
                postData.appId = that.ajaxParams.appId
                that.loading = true;
                that.receiveReward(postData,that.receiveRewardHandler)
            },
            SHA1:function(sIn) {

// SHA1
                function add(x, y) {
                    return((x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)) ^ (x & 0x80000000) ^ (y & 0x80000000);
                }

                function SHA1hex(num) {
                    var sHEXChars = "0123456789abcdef";
                    var str = "";
                    for(var j = 7; j >= 0; j--)
                        str += sHEXChars.charAt((num >> (j * 4)) & 0x0F);
                    return str;
                }

                function AlignSHA1(sIn) {
                    var nblk = ((sIn.length + 8) >> 6) + 1,
                        blks = new Array(nblk * 16);
                    for(var i = 0; i < nblk * 16; i++) blks[i] = 0;
                    for(i = 0; i < sIn.length; i++)
                        blks[i >> 2] |= sIn.charCodeAt(i) << (24 - (i & 3) * 8);
                    blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);
                    blks[nblk * 16 - 1] = sIn.length * 8;
                    return blks;
                }

                function rol(num, cnt) {
                    return(num << cnt) | (num >>> (32 - cnt));
                }

                function ft(t, b, c, d) {
                    if(t < 20) return(b & c) | ((~b) & d);
                    if(t < 40) return b ^ c ^ d;
                    if(t < 60) return(b & c) | (b & d) | (c & d);
                    return b ^ c ^ d;
                }

                function kt(t) {
                    return(t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
                        (t < 60) ? -1894007588 : -899497514;
                }
               var x = AlignSHA1(sIn);
               var w = new Array(80);
               var a = 1732584193;
               var b = -271733879;
               var c = -1732584194;
               var d = 271733878;
               var e = -1009589776;
               for(var i = 0; i < x.length; i += 16) {
                   var olda = a;
                   var oldb = b;
                   var oldc = c;
                   var oldd = d;
                   var olde = e;
                   for(var j = 0; j < 80; j++) {
                       if(j < 16) w[j] = x[i + j];
                       else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                       t = add(add(rol(a, 5), ft(j, b, c, d)), add(add(e, w[j]), kt(j)));
                       e = d;
                       d = c;
                       c = rol(b, 30);
                       b = a;
                       a = t;
                   }
                   a = add(a, olda);
                   b = add(b, oldb);
                   c = add(c, oldc);
                   d = add(d, oldd);
                   e = add(e, olde);
               }
               SHA1Value = SHA1hex(a) + SHA1hex(b) + SHA1hex(c) + SHA1hex(d) + SHA1hex(e);
               return SHA1Value.toUpperCase();
            },
        },
        mounted: function() {
            var that = this;
            // 获取链接上的参数
            that.urlParams = that.$tools.getUrlParams();
            that.ajaxParams.status = that.urlParams.status;
            that.ajaxParams.appId = that.urlParams.id;
            var token = that.urlParams.token;
            var userId = that.urlParams.userId;
            var timestamp=new Date().getTime();
            //自动登录
            var autoLoginAjaxparams = {
                token:token,
                userId:userId,
                signature:that.SHA1(timestamp+token+userId).toLowerCase(),
                timestamp:timestamp,
            }
            that.autoLogin(autoLoginAjaxparams,that.autoLoginHandler)

            //判断时Android还时iOS
            var u = navigator.userAgent;
            that.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
            that.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            that.ajaxParams.type = 1;
            //if(that.ajaxParams.status==1){
            //    $('.open-app').css('background-color','#ff3e1e');
            //}else{
            //    $('.open-app').css('background-color','darkgray');
            //}
            that.getAppDetail(that.ajaxParams,that.getAppDetailHandler)
            //console.log($('body').height());
            // 下拉刷新
            var $section = $('body'),
                $win = $(window),
                timer = null;
            $win.scroll(function (e) {
                var st = $win.scrollTop(),
                    $sectionBox = $('.dataList');
                if (($sectionBox.height() > $section.height()) && (st > ($sectionBox.height() - $section.height() - 300))) {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function () {
                        console.log(that.page.currentPage + ':' + that.page.lastPage)
                        //当前页小于最后页  执行翻页请求
                        if (+that.page.currentPage < +that.page.lastPage && !that.loading) {
                            that.ajaxParams.page = +that.page.currentPage + 1;
                            //console.log('执行翻页：' + that.pageConfig.page)
                            //    获取列表
                            that.loading = true;
                            that.getAppDetail(that.ajaxParams,that.getAppDetailHandler)
                        }
                        // that.$myalert(12333333);
                    }, 200);
                }
            });
        }
    });
})();