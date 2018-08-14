app.register.controller('save-house-order-list', function ($scope,$rootScope,$timeout,rentalHouseService,_validate) {
    'use strict';

    var ajaxParams = {
        status:'',
        realName:'',//存房客户姓名
        mobile:'',// 存房客户号码
        managerRealName:'',//转介人姓名
        managerMobile:'',// 转介人号码
        page:'1'
    },
    paginData = { // 存储分页数据
        currentPage :'',
        from:'',
        to:'',
        lastPage:'',
        perPage:10,
        total:0
    };

    $scope.state = {
        hasMoreData:false, //是否还有剩余分页数据
        // 分页
        showPagin:false, // 是否显示分页
        currentPage:'', // 当前页码
        lastPage:'',// 最后一页
        total:'',//总页数
        dataNone: false,
        isShowNewOrder: false,//是否显示弹框显示新订单
    };
    
    
    // 获取列表数据
    $scope.list = [];
    $scope.search = {
        status:'-1',
        realName:'',//存房客户姓名
        mobile:'',// 存房客户号码
        managerRealName:'',//转介人姓名
        managerMobile:'',// 转介人号码
        inputCurPage:'' // 分页用
    };
    var getSaveHouseOrderList = function(opt, cb, cberr) {
        rentalHouseService.getSaveHouseOrderList(opt)
            .then(function(data) {
                if(typeof cb === 'function')cb(data);
            }, function(data) {
                if(typeof cberr === 'function')cberr(data);
            });
    },
    getSaveHouseOrderListHandler = function(data) {
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

    getSaveHouseOrderList(ajaxParams, getSaveHouseOrderListHandler);

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

    // -- 判断是否有新订单
    var checkNewOrder = function(opt, cb, cberr) {
            rentalHouseService.checkNewOrder(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        checkNewOrderHandler = function(data) {
            if(data && data['__state'] && data['__state'].code === 10200) {
                //layer.alert(data['__state'].msg, function(idx) {
                //    layer.closeAll();
                //    $rootScope.$state.go('rent-house-list',{id:''});
                //});
                //console.log(data)
                if(data.alert == 1){
                    if(allIdx && $scope.state.isShowNewOrder) {
                        return;
                    }
                    $scope.act.openTankuang()
                    clearInterval(tankuan)
                    return false;
                }
            }
        };

    // -- 取消新订单提醒
    var cancleNewOrder = function(opt, cb, cberr) {
            rentalHouseService.cancleNewOrder(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        cancleNewOrderHandler = function(data) {
            if(data && data['__state'] && data['__state'].code === 10200) {
                //layer.alert(data['__state'].msg, function(idx) {
                    //layer.closeAll();
                $rootScope.$state.go('save-house-order-list');
                window.location.reload();
                //});
            }
        };

    var tankuan = setInterval(function () {
        if($rootScope.$state.current.name == 'save-house-order-list') {
            checkNewOrder({},checkNewOrderHandler)
        }else {
            clearInterval(tankuan);
        }
    },120000)
    $rootScope.$on('$stateChangeStart', function(event, transition) {
      clearInterval(tankuan);
    });

    var allIdx = null;
    $scope.act = {
        // 搜素按钮事件
        doSearch: function() {
            $scope.search.page = 1;
            ajaxParams = matchAjaxParams($scope.search, ajaxParams);
            getSaveHouseOrderList(ajaxParams, getSaveHouseOrderListHandler);
        },
        goPrePage:function() { // 上一页
            if(paginData.currentPage > 1) {
                $scope.search.page = parseInt(paginData.currentPage, 10) - 1;
                ajaxParams.page = $scope.search.page;
                getSaveHouseOrderList(ajaxParams, getSaveHouseOrderListHandler);
            }
        },
        goNextPage:function() { // 下一页
            if(paginData.currentPage < paginData.lastPage) {
                $scope.search.page = parseInt(paginData.currentPage, 10) + 1;
                ajaxParams.page = $scope.search.page;
                getSaveHouseOrderList(ajaxParams, getSaveHouseOrderListHandler);
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
            getSaveHouseOrderList(ajaxParams, getSaveHouseOrderListHandler);
        },
        keyGoToPage:function(e) {
            var keyCode = +e.keyCode;
            if(keyCode === 13) {
                this.goToPage();
            }
        },
        openTankuang: function () {
            //打开弹窗
            $scope.state.isShowNewOrder = true;
            clearInterval(tankuan)
            //return false;
            $timeout(function(){
                allIdx = layer.open({
                    type: 1
                    ,title: false //不显示标题栏
                    ,closeBtn: false
                    ,area: ['500px','180px']//初始化Layer高度
                    ,shade: 0.8
                    ,btn: ['进入审核']
                    ,content: $('#isShowNewOrder')
                    ,yes: function(){
                        cancleNewOrder({},cancleNewOrderHandler)
                        $scope.state.isShowNewOrder = false;
                        layer.closeAll();
                        allIdx = null;
                        clearInterval(tankuan);
                    }
                    ,btn2: function(){
                        $scope.state.isShowPinggu = false;
                        layer.closeAll();
                        allIdx = null;
                        clearInterval(tankuan);
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
