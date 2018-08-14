/**
 * Created by Administrator on 2018/5/28.
 */
app.register.controller('code-management', function ($scope,$rootScope,$timeout,rentalHouseService,_validate,_setting) {
    'use strict';

    var ajaxParams = {
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
        num:'',//批量获取的数量
        hasMoreData:false, //是否还有剩余分页数据
        // 分页
        showPagin:false, // 是否显示分页
        currentPage:'', // 当前页码
        lastPage:'',// 最后一页
        total:'',//总页数
        dataNone: false,
        isShowNewOrder: false,//是否显示弹框显示新订单
        isShowGetCode: false,//是否显示弹框显示批量获取二维码
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
    var getCodeList = function(opt, cb, cberr) {
            rentalHouseService.getCodeList(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        getCodeListHandler = function(data) {
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

    getCodeList({}, getCodeListHandler);

    // --批量获取二维码
    var getBatchCode= function(opt, cb, cberr) {
            rentalHouseService.getBatchCode(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        getBatchCodeHandler = function(data) {
            layer.closeAll('loading');
            if(data && data['__state'] && data['__state'].code===10200) {
                layer.alert('保存成功', function(idx) {
                    layer.close(idx);
                    window.location.reload();
                    //$scope.state.isShowGetCode = false;
                    //layer.closeAll();
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
                    $scope.act.openTankuang()
                    clearInterval(tankuan)
                    return false
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
        checkNewOrder({},checkNewOrderHandler)
    },120000)

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
                getCodeList({}, getCodeListHandler);
            }
        },
        goNextPage:function() { // 下一页
            if(paginData.currentPage < paginData.lastPage) {
                $scope.search.page = parseInt(paginData.currentPage, 10) + 1;
                ajaxParams.page = $scope.search.page;
                getCodeList({}, getCodeListHandler);
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
            getCodeList({}, getCodeListHandler);
        },
        keyGoToPage:function(e) {
            var keyCode = +e.keyCode;
            if(keyCode === 13) {
                this.goToPage();
            }
        },
        getCode: function () {
            $scope.state.isShowGetCode = true;
            $timeout(function(){
                layer.open({
                    type: 1
                    ,title: false //不显示标题栏
                    ,closeBtn: false
                    ,area: ['500px','auto']//初始化Layer高度
                    ,shade: 0.8
                    ,btn: ['确认获取','取消']
                    ,content: $('#getCode')
                    ,yes: function(){
                        if( !_validate.isRequired($scope.state.num)){
                            layer.alert('填写批量获取数量！');
                            return false;
                        }
                        layer.load('2')
                        getBatchCode({num:$scope.state.num},getBatchCodeHandler)
                    }
                    ,btn2: function(){
                        $scope.state.isShowGetCode = false;
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
        openTankuang: function () {
            //打开弹窗
            $scope.state.isShowNewOrder = true;
            $timeout(function(){
                layer.open({
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
                    }
                    ,btn2: function(){
                        $scope.state.isShowPinggu = false;
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
        downLoad: function (id) {
            var url = _setting.get('base') + '/acjl-admin/rent-house/list-export?batch_id='+id;
            console.log(url)
            //return
            window.open(url);

        }

    };
});
