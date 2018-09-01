/**
 * Created by Administrator on 2018/8/26.
 */
app.register.controller('backstage-account-list', function ($scope, $timeout,ApplicationService, _validate) {

    'use strict';

    var ajaxParams = {
            name:'',
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
        name:'',
        mobile:'',
        password:'',
    },
        $scope.state = {
            isShowAdd:false,//是否显示
            isiOS:1,// 应用类型 0为安卓 1为iOS
            file:'',
            isqiyong:'',
            adminUserCount:0,//后台总人数
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
        name:'',
        page:'1'
    };
    var getBackstageList = function(opt, cb, cberr) {
            ApplicationService.getBackstageList(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        getBackstageListHandler = function(data) {
            console.log(typeof data)
            console.log(data)
            $scope.list = data.data;
            $scope.state.adminUserCount = data.adminUserCount;
            if(data.data.length == 0){
                $scope.state.dataNone = true;
            }else{
                $scope.state.dataNone = false;
            }

            comparePagin(paginData, data); // 保存分页数据
            $scope.state.showPagin = (data.lastPage > 1);
            $scope.state.hasMoreData = (data.currentPage < data.lastPage);
        };

    getBackstageList(ajaxParams, getBackstageListHandler);

    // -- 添加后台管理员账号
    var addAccount = function(opt, cb, cberr) {
            ApplicationService.addAccount(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        addAccountHandler = function(data) {
            if(data && data['__state'] && data['__state'].code === 200) {
                console.log('reload')
                layer.alert('添加成功', function () {
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

    $scope.act = {
        // 搜素按钮事件
        doSearch: function() {
            $scope.search.page = 1;
            ajaxParams = matchAjaxParams($scope.search, ajaxParams);
            console.log(ajaxParams)
            getBackstageList(ajaxParams, getBackstageListHandler);
        },
        goPrePage:function() { // 上一页
            if(paginData.currentPage > 1) {
                $scope.search.page = parseInt(paginData.currentPage, 10) - 1;
                ajaxParams.page = $scope.search.page;
                getBackstageList(ajaxParams, getBackstageListHandler);
            }
        },
        goNextPage:function() { // 下一页
            if(paginData.currentPage < paginData.lastPage) {
                $scope.search.page = parseInt(paginData.currentPage, 10) + 1;
                ajaxParams.page = $scope.search.page;
                getBackstageList(ajaxParams, getBackstageListHandler);
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
            getBackstageList(ajaxParams, getBackstageListHandler);
        },
        keyGoToPage:function(e) {
            var keyCode = +e.keyCode;
            if(keyCode === 13) {
                this.goToPage();
            }
        },
        addAccountLayer: function () {
            $scope.state.isShowAdd = true;//显示弹窗列表
            $timeout(function(){
                layer.open({
                    type: 1
                    ,title: false //不显示标题栏
                    ,closeBtn: false
                    ,area: ['400px','auto']//初始化Layer高度
                    ,shade: 0.8
                    ,btn: ['添加', '取消']
                    ,content: $('#addAccount')
                    ,yes: function(){
                        if(!_validate.isRequired($scope.addAjaxParams.name)) {
                            layer.alert('请填写用户名称！');
                            return false;
                        }
                        if(!_validate.isRequired($scope.addAjaxParams.mobile)) {
                            layer.alert('请填写用户手机号码！');
                            return false;
                        }
                        if(!_validate.isRequired($scope.addAjaxParams.password)) {
                            layer.alert('请填写用户密码！');
                            return false;
                        }
                        addAccount($scope.addAjaxParams,addAccountHandler);
                        $scope.state.isShowAdd = false;
                        layer.closeAll();

                    }
                    ,btn2: function(){
                        $scope.addAjaxParams.name    = '';
                        $scope.addAjaxParams.mobile = '';
                        $scope.addAjaxParams.password = '';
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
        }
    };
});