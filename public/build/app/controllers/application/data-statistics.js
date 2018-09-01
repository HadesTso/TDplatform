/**
 * Created by Administrator on 2018/8/26.
 */
app.register.controller('data-statistics', function ($scope, $timeout,ApplicationService, _validate) {

    'use strict';

    var ajaxParams = {
            type:1,
            name:'',
            status:'',
            startTime:'',
            endTime:'',
            page:'1'
        },
        ajaxParams2 = {
            type:0,
            name:'',
            status:'',
            startTime:'',
            endTime:'',
            page:'1'
        },
        paginData = { // 存储分页数据
            currentPage :'',
            from:'',
            to:'',
            lastPage:'',
            perPage:10,
            total:0,
            inputCurPage:''
        },
        paginData2 = { // 存储分页数据
            currentPage :'',
            from:'',
            to:'',
            lastPage:'',
            perPage:10,
            total:0,
            inputCurPage:''
        };

    $scope.addAjaxParams = {
        type:'',
        name:'',
        logo:'',
        money:'',
        num:'',
        rank:'',
        note:'',
        packName:'',
        urlscheme:'',
    },
        $scope.state = {
            isShowAdd:'',//是否显示
            isiOS:1,// 应用类型 0为安卓 1为iOS
            iOSreword:0,//ios总奖励数
            androidreword:0,//安卓总奖励数
            iOSNum:0,//ios总用户数
            androidNum:0,//安卓总用户数
            file:'',

            // 分页ios
            hasMoreData:false, //是否还有剩余分页数据
            showPagin:false, // 是否显示分页
            currentPage:'', // 当前页码
            lastPage:'',// 最后一页
            total:'',//总页数
            dataNone: false,
            // 分页android
            hasMoreData2:false, //是否还有剩余分页数据
            showPagin2:false, // 是否显示分页
            currentPage2:'', // 当前页码
            lastPage2:'',// 最后一页
            total2:'',//总页数
            dataNone2: false
        };

    // 获取列表数据
    $scope.list = [];
    $scope.search = {
        name:'',
        page:'1',
        page2:'1',
        inputCurPage2:''
    };
    var getiOSApplicationList = function(opt, cb, cberr) {
            ApplicationService.getApplicationList(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        getiOSApplicationListHandler = function(data) {
            $scope.iOSlist = data.data;
            $scope.state.iOSreword = data.rewards;
            $scope.state.iOSNum = data.iosCount;
            if(data.data.length == 0){
                $scope.state.dataNone = true;
            }else{
                $scope.state.dataNone = false;
            }

            comparePagin(paginData, data); // 保存分页数据
            $scope.state.showPagin = (data.lastPage > 1);
            $scope.state.hasMoreData = (data.currentPage < data.lastPage);
        };

    var getApplicationList = function(opt, cb, cberr) {
        ApplicationService.getApplicationList(opt)
            .then(function(data) {
                if(typeof cb === 'function')cb(data);
            }, function(data) {
                if(typeof cberr === 'function')cberr(data);
            });
        },
        getAndoridApplicationListHandler = function(data) {
            $scope.androidlist = data.data;
            $scope.state.androidreword = data.rewards;
            $scope.state.androidNum = data.androidCount;
            if(data.data.length == 0){
                $scope.state.dataNone2 = true;
            }else{
                $scope.state.dataNone2 = false;
            }

            comparePagin2(paginData2, data); // 保存分页数据
            $scope.state.showPagin2 = (data.lastPage > 1);
            $scope.state.hasMoreData2 = (data.currentPage < data.lastPage);
        };
    //ajaxParams.type = 0;
    getiOSApplicationList(ajaxParams, getiOSApplicationListHandler);
    //ajaxParams2.type = 1;
    getApplicationList(ajaxParams2, getAndoridApplicationListHandler);


    // 匹配模型中的参数 到 请求参数
    var matchAjaxParams = function(modelParams, reqParams) {
            var temp = '';
            for(var key in modelParams) {
                temp = modelParams[key] !== ''?modelParams[key]:'';
                reqParams[key] = temp;
            }
            return reqParams;
        },
    // 对比并显示分页数据
        comparePagin = function(target, source) {
            target.currentPage = parseInt(source.currentPage, 10);
            target.from = parseInt(source.from, 10);
            target.to = parseInt(source.to, 10);
            target.lastPage = parseInt(source.lastPage, 10);
            target.perPage = parseInt(source.perPage, 10);
            target.total = parseInt(source.total, 10);

            $scope.state.currentPage = target.currentPage;
            $scope.state.lastPage = target.lastPage;
            $scope.state.total = target.total;

            return target;
        },
    // 对比并显示分页数据
    comparePagin2 = function(target, source) {
        target.currentPage = parseInt(source.currentPage, 10);
        target.from = parseInt(source.from, 10);
        target.to = parseInt(source.to, 10);
        target.lastPage = parseInt(source.lastPage, 10);
        target.perPage = parseInt(source.perPage, 10);
        target.total = parseInt(source.total, 10);

        $scope.state.currentPage2 = target.currentPage;
        $scope.state.lastPage2 = target.lastPage;
        $scope.state.total2 = target.total;

        return target;
    };

    $scope.cb = {
        uploadImgBanner:function(data) {
            uploadImg({base64File:data} ,uploadBanner);
        }
    };

    $scope.act = {
        // 搜素按钮事件
        doSearch: function() {
            $scope.search.page = 1;
            ajaxParams = matchAjaxParams($scope.search, ajaxParams);
            ajaxParams.type = 1;
            getiOSApplicationList(ajaxParams, getiOSApplicationListHandler);
            ajaxParams.type = 0;
            getApplicationList(ajaxParams, getAndoridApplicationListHandler);
        },
        goPrePage:function() { // 上一页
            if(paginData.currentPage > 1) {
                $scope.search.page = parseInt(paginData.currentPage, 10) - 1;
                ajaxParams.page = $scope.search.page;
                getiOSApplicationList(ajaxParams, getiOSApplicationListHandler);
            }
        },
        goNextPage:function() { // 下一页
            if(paginData.currentPage < paginData.lastPage) {
                $scope.search.page = parseInt(paginData.currentPage, 10) + 1;
                ajaxParams.page = $scope.search.page;
                getiOSApplicationList(ajaxParams, getiOSApplicationListHandler);
            }
        },
        goToPage:function() {
            var isNum = /^\d+$/gi,
                num = 0;
            if(isNum.test($.trim( $scope.search.inputCurPage ))) {
                num = parseInt($scope.search.inputCurPage, 10);
                if(num < 1) {
                    num = 1;
                }
                if(num > paginData.lastPage){
                    num = paginData.lastPage;
                }
                $scope.search.page = num;
            }else {
                $scope.search.page = 1;
            }
            ajaxParams.page = $scope.search.page;
            getiOSApplicationList(ajaxParams, getiOSApplicationListHandler);
        },
        keyGoToPage:function(e) {
            var keyCode = +e.keyCode;
            if(keyCode === 13) {
                this.goToPage();
            }
        },

        goPrePage2:function() { // 上一页
            if(paginData2.currentPage > 1) {
                $scope.search.page = parseInt(paginData2.currentPage, 10) - 1;
                ajaxParams2.page = $scope.search.page;
                getApplicationList(ajaxParams2, getAndoridApplicationListHandler);
            }
        },
        goNextPage2:function() { // 下一页
            if(paginData2.currentPage < paginData2.lastPage) {
                $scope.search.page = parseInt(paginData2.currentPage, 10) + 1;
                ajaxParams2.page = $scope.search.page;
                getApplicationList(ajaxParams2, getAndoridApplicationListHandler);
            }
        },
        goToPage2:function() {
            var isNum = /^\d+$/gi,
                num = 0;
            if(isNum.test($.trim( $scope.search.inputCurPage2 ))) {
                num = parseInt($scope.search.inputCurPage2, 10);
                if(num < 1) {
                    num = 1;
                }
                if(num > paginData2.lastPage){
                    num = paginData2.lastPage;
                }
                $scope.search.page2 = num;
            }else {
                $scope.search.page2 = 1;
            }
            ajaxParams2.page = $scope.search.page2;
            getApplicationList(ajaxParams2, getAndoridApplicationListHandler);
        },
        keyGoToPage2:function(e) {
            var keyCode = +e.keyCode;
            if(keyCode === 13) {
                this.goToPage();
            }
        },

        addApplication: function () {
            $scope.state.isShowAdd = true;//显示弹窗列表
            $timeout(function(){
                layer.open({
                    type: 1
                    ,title: false //不显示标题栏
                    ,closeBtn: false
                    ,area: ['680px','auto']//初始化Layer高度
                    ,shade: 0.8
                    ,btn: ['添加', '取消']
                    ,content: $('#addApp')
                    ,yes: function(){
                        $scope.addAjaxParams.type = $scope.state.isiOS;

                        //function showResponse(data) {
                        //    console.log(data)
                        //}
                        //var options = {
                        //    url:'/admin/app/add',
                        //    beforeSubmit:  $scope.addAjaxParams,  //提交前处理
                        //    success:       showResponse,  //处理完成
                        //    resetForm: true,
                        //    dataType:  'json'
                        //};
                        //
                        //$('.index_form').submit(function() { //注意这里的index_form
                        //    $(this).ajaxSubmit(options);
                        //    return false;//防止dialog 自动关闭
                        //});
                        //
                        //return false;

                        //var formdata = new FormData($$('form')[0]);
                        $.ajax({
                            url: '/admin/app/add',
                            type: 'GET  ',
                            datatype: 'json',
                            data: $scope.addAjaxParams,
                            cache:false,
                            traditional: true,
                            contentType: false,
                            processData: false,
                            success: function (data) {},
                            error: function () {}
                        });

                        //if(!_validate.isRequired(postData.weight)) {
                        //layer.alert('请填写权重');
                        //return false;
                        //}

                        //getApplication($scope.addAjaxParams,addApplicationHandler);
                        $scope.state.showEditList = false;
                        layer.closeAll();

                    }
                    ,btn2: function(){
                        console.log($scope.state.number);
                        $scope.state.showEditList = false;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }
                    ,success: function(layero){
                        layero.find('.layui-layer-btn').css('text-align', 'center');
                        $('.layui-layer-content').css({'height':'auto','overflow':'visible'});
                    }
                });
            },0);
        },
    };
});