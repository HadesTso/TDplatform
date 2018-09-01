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
            ajaxParams:{
                page:'1',//页码
                //status:'',//状态
                //search:'',//搜索
            },
            makeSureAjaxParams:{//确认评估参数
                id:'',//id
                status:50,//30为评估成功，40为评估失败，50为确认签约
                imgurls:[],// 图片url 评估成功或者确认签约时必传
                imgIds:'',// 图片id 评估成功或者确认签约时必传
                note:'',// 评估备注
            },
            page:'',//保存分页数据
        },
        methods:{
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
                    console.log(data.data)

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
            makeSure: function(opt, cb, cberr) {
                var that = this;
                var url = '/jf/save-order/upload-data';
                that.$httpPost(url, opt)
                    .then(cb, cberr);
            },
            makeSureHandle: function (data) {
                var that = this;
                that.loading = false;
                if(data && data.state && data.state.code === 10200) {
                    that.$myalert(data.state.msg)
                    //that.list.push(...data.data.data);
                    //that.page = data.data
                    window.location.reload();
                    $(".layer").css("display","none");
                }
            },

            submit: function () {
                var that = this;
                that.makeSureAjaxParams.imgIds=that.makeSureAjaxParams.imgIds.substring(0,that.makeSureAjaxParams.imgIds.length-1)
                //that.makeSureAjaxParams.imgIds = that.urlId;
                //if(that.makeSureAjaxParams.status == 50){
                    if(that.makeSureAjaxParams.imgIds == ''){
                        that.$myalert("图片不能为空！")
                        return false;
                    }
                //}
                that.loading = true;
                that.makeSure(that.makeSureAjaxParams,that.makeSureHandle)
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
        }
        },
        mounted: function() {
            var that = this;
            // 获取链接上的参数
            that.urlParams = that.$tools.getUrlParams();
            that.ajaxParams.status = that.urlParams.status;
            that.ajaxParams.appId = that.urlParams.id;
            console.log(that.urlParams)
            //判断时Android还时iOS
            var u = navigator.userAgent;
            that.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
            that.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if(that.isiOS){
                that.ajaxParams.type = 1;
            }else{
                that.ajaxParams.type = 0;
            }
            if(that.ajaxParams.status==1){
                $('.open-app').css('background-color','#ff3e1e');
            }else{
                $('.open-app').css('background-color','darkgray');
            }
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