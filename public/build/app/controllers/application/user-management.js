/**
 * Created by Administrator on 2018/8/26.
 */
app.register.controller('user-management', function ($scope, $timeout,ApplicationService, _validate) {

    'use strict';

    var ajaxParams = {
            type:'',
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
            file:'',
            // 分页
            hasMoreData:false, //是否还有剩余分页数据
            showPagin:false, // 是否显示分页
            currentPage:'', // 当前页码
            lastPage:'',// 最后一页
            total:'',//总页数
            dataNone: false
        };

    // 获取列表数据
    $scope.list = [];
    $scope.search = {
        type:'',
        name:'',
        status:'',
        startTime:'',
        endTime:'',
        page:'1'
    };
    var getAppUserList = function(opt, cb, cberr) {
            ApplicationService.getAppUserList(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        getAppUserListHandler = function(data) {
            console.log(data)
            $scope.list = data.data;
            $scope.page = data;
            if(data.data.length == 0){
                $scope.state.dataNone = true;
            }else{
                $scope.state.dataNone = false;
            }

            comparePagin(paginData, data); // 保存分页数据
            $scope.state.showPagin = (data.lastPage > 1);
            $scope.state.hasMoreData = (data.currentPage < data.lastPage);
        };

    getAppUserList(ajaxParams, getAppUserListHandler);

    // -- 更改用户状态
    var changeStatus = function(opt, cb, cberr) {
            ApplicationService.changeUserStatus(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        changeStatusHandler = function(data) {
            console.log(data)
            layer.closeAll();
            if(data && data['__state'] && data['__state'].code === 200) {
                layer.alert(data['__state'].msg, function () {
                    window.location.reload();
                });
                //getTeamMateList(ajaxParams, getTeamMateListHandler);
            }
        };


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
            getAppUserList(ajaxParams, getAppUserListHandler);
        },
        goPrePage:function() { // 上一页
            if(paginData.currentPage > 1) {
                $scope.search.page = parseInt(paginData.currentPage, 10) - 1;
                ajaxParams.page = $scope.search.page;
                getAppUserList(ajaxParams, getAppUserListHandler);
            }
        },
        goNextPage:function() { // 下一页
            if(paginData.currentPage < paginData.lastPage) {
                $scope.search.page = parseInt(paginData.currentPage, 10) + 1;
                ajaxParams.page = $scope.search.page;
                getAppUserList(ajaxParams, getAppUserListHandler);
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
            getAppUserList(ajaxParams, getAppUserListHandler);
        },
        keyGoToPage:function(e) {
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
        changeStatus: function (id,status) {
            layer.load(2)
            changeStatus({userId:id,status:status},changeStatusHandler)
        }
    };
});