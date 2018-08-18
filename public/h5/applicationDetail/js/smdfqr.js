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
                status:'',//状态
                search:'',//搜索
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
            getSmdfqrList: function(opt, cb, cberr) {
                var that = this;
                var url = '/jf/save-order/order-list';
                that.$httpGet(url, opt)
                    .then(cb, cberr);
            },
            getSmdfqrListHandle: function (data) {
                var that = this;
                that.loading = false;
                that.ajaxParams.search = '';
                if(data && data.state && data.state.code === 10200) {
                    that.list.push(...data.data.data);
                    that.page = data.data;
                    //that.list = data.data.data
                    console.log(that.list)
                    console.log(data.data)

                    for(var i=0;i<data.data.data.length;i++){
                        var a = data.data.data[i].mobile.slice(0,3);
                        var b = data.data.data[i].mobile.slice(7,11);
                        that.list[i].mobile = a + '****' +b;

                    }
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
            testApp: function (rul) {
                var timeout, t = 1000, hasApp = true;
                setTimeout(function () {
                    if (hasApp) {
                        alert('安装了app');
                    } else {
                        alert('未安装app');
                    }
                    document.body.removeChild(ifr);
                }, 2000)
                var t1 = Date.now();
                var ifr = document.createElement("iframe");
                ifr.setAttribute('src', url);
                ifr.setAttribute('style', 'display:none');
                document.body.appendChild(ifr);
                timeout = setTimeout(function () {
                    var t2 = Date.now();
                    if (!t1 || t2 - t1 < t + 100) {
                        hasApp = false;
                    }
                }, t);
            }
        },
        mounted: function() {
            var that = this;
            // 获取链接上的参数
            that.urlParams = that.$tools.getUrlParams();
            that.urlStatus = that.urlParams.status;
            that.ajaxParams.status = that.urlStatus;

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
                            that.getSmdfqrList(that.ajaxParams,that.getSmdfqrListHandle)
                        }
                        // that.$myalert(12333333);
                    }, 200);
                }
            });
        }
    });
})();