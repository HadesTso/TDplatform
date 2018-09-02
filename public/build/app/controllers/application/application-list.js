/**
 * Created by Administrator on 2018/8/23.
 */
app.register.controller('application-list', function ($scope, $timeout,ApplicationService, _validate) {

    'use strict';

    var ajaxParams = {
            type:1,
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
        type:1,
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
        isShowAdd:'',//是否显示添加应用弹框
        ismakesure:false,//是否显示二次确认弹框
        isiOS:1,// 应用类型 0为安卓 1为iOS
        appStatus:'',//应用状态，是否上架，上架未1，下架为2
        file:'',
        image:'',
        base64:'',
        duo:'1',
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
        status:'2',
        startTime:'',
        endTime:'',
        page:'1'
    };
    $scope.send = {
        logo:'',
    }
    var getApplicationList = function(opt, cb, cberr) {
            ApplicationService.getApplicationList(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        getApplicationListHandler = function(data) {
            console.log(typeof data)
            console.log(data)
            $scope.list = data.data;
            if(data.data.length == 0){
                $scope.state.dataNone = true;
            }else{
                $scope.state.dataNone = false;
            }

            comparePagin(paginData, data); // 保存分页数据
            $scope.state.showPagin = (data.lastPage > 1);
            $scope.state.hasMoreData = (data.currentPage < data.lastPage);
        };

    getApplicationList(ajaxParams, getApplicationListHandler);

    // -- 添加应用
    var addApplication = function(opt, cb, cberr) {
            ApplicationService.addApplication(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        addApplicationHandler = function(data) {
            //var data = JSON.parse(data)
            console.log(typeof data)
            console.log(data)
            console.log(data.data)
            console.log(data.__state)
            console.log(data.__state.code)
            if(data && data['__state'] && data['__state'].code === 200) {
                console.log('reload')
                layer.alert(data['__state'].msg, function () {
                    window.location.reload();
                });
                //getTeamMateList(ajaxParams, getTeamMateListHandler);
            }
        };

    // -- 添加应用
    var doOnline = function(opt, cb, cberr) {
            ApplicationService.online(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        doOnlineHandler = function(data) {
            if(data && data['__state'] && data['__state'].code === 200) {
                console.log('reload')
                layer.alert(data['__state'].msg, function () {
                    window.location.reload();
                });
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
            $scope.search.type = 1;
            ajaxParams = matchAjaxParams($scope.search, ajaxParams);
            getApplicationList(ajaxParams, getApplicationListHandler);
        },
        doExport: function () {
            window.location.href="/admin/project/project-list-export?project_id="+ajaxParams.projectId+"&&project_name="+ajaxParams.projectName+"&&city="+ajaxParams.city+"&&district="+ajaxParams.district+"&&is_recommend="+ajaxParams.isRecommend+"&&is_collaborate="+ajaxParams.isCollaborate
            //doExport(ajaxParams,doExportHandler)
        },
        goPrePage:function() { // 上一页
            if(paginData.currentPage > 1) {
                $scope.search.page = parseInt(paginData.currentPage, 10) - 1;
                ajaxParams.page = $scope.search.page;
                getApplicationList(ajaxParams, getApplicationListHandler);
            }
        },
        goNextPage:function() { // 下一页
            if(paginData.currentPage < paginData.lastPage) {
                $scope.search.page = parseInt(paginData.currentPage, 10) + 1;
                ajaxParams.page = $scope.search.page;
                getApplicationList(ajaxParams, getApplicationListHandler);
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
            getApplicationList(ajaxParams, getApplicationListHandler);
        },
        keyGoToPage:function(e) {
            var keyCode = +e.keyCode;
            if(keyCode === 13) {
                this.goToPage();
            }
        },
        addApplicationLayer: function () {
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
                        $scope.addAjaxParams.logo = $scope.state.base64;
                        if(!_validate.isRequired($scope.addAjaxParams.name)) {
                            layer.alert('请填写应用名称');
                            return false;
                        }
                        if(!_validate.isRequired($scope.addAjaxParams.num)) {
                            layer.alert('请填写应用份数');
                            return false;
                        }
                        if(!_validate.isRequired($scope.addAjaxParams.rank)) {
                            layer.alert('请填写搜索排名');
                            return false;
                        }
                        if(!_validate.isRequired($scope.addAjaxParams.packName)) {
                            layer.alert('请填写包名');
                            return false;
                        }if(!_validate.isRequired($scope.addAjaxParams.urlscheme)) {
                            layer.alert('请填写协议名');
                            return false;
                        }
                        if(!_validate.isRequired($scope.addAjaxParams.logo)) {
                            layer.alert('请上传应用logo');
                            return false;
                        }
                        if(!_validate.isRequired($scope.addAjaxParams.money)) {
                            layer.alert('请填写应用奖励');
                            return false;
                        }
                        addApplication($scope.addAjaxParams,addApplicationHandler);
                        $scope.state.isShowAdd = false;
                        layer.closeAll();

                    }
                    ,btn2: function(){
                        console.log($scope.state.number);
                        $scope.state.isShowAdd = false;
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
        onlinelayer: function (item) {
            var postData = {}
            postData.appId = item.appId;
            if(item.status==1){
                postData.status = 0;
                $scope.state.appStatus = 0;
            }else{
                postData.status = 1;
                $scope.state.appStatus = 1;
            }
            $scope.state.ismakesure = true;//显示弹窗列表
            $timeout(function(){
                layer.open({
                    type: 1
                    ,title: false //不显示标题栏
                    ,closeBtn: false
                    ,area: ['400px','auto']//初始化Layer高度
                    ,shade: 0.8
                    ,btn: ['确认', '取消']
                    ,content: $('#makesure')
                    ,yes: function(){
                        doOnline(postData,doOnlineHandler);
                        $scope.state.ismakesure = false;
                        layer.closeAll();

                    }
                    ,btn2: function(){
                        $scope.state.ismakesure = false;
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
        }
    };
});