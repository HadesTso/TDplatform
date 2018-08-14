/**
 * Created by Administrator on 2018/5/16.
 */
app.register.controller('area-management', function ($scope,$rootScope,rentalHouseService,CommonService,$timeout,_validate) {

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
        showEditList:false,
        isUpdate:false,
        name:'',
        address:'',
        isShowNewOrder: false,//是否显示弹框显示新订单

    };

    // 获取列表数据
    $scope.list = [];
    $scope.search = {
        name:'',
        page:'1',
        inputCurPage:'' // 分页用
    };
    var getRentEstateList = function(opt, cb, cberr) {
            rentalHouseService.getAreaManagementList(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        getRentEstateListHandler = function(data) {
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

    getRentEstateList(ajaxParams, getRentEstateListHandler);

    // 省市区三级联动
    $scope.selectedPlace = {
        provinceCode: '', //省编号
        cityCode: '', //市编号
        blockCode: '', //区/县编号
        provinceName: '', //省名
        cityName: '', //市名
        blockName: '', //区/县名
    };
    $scope.region = {
        provinces: [],
        cities: [],
        blocks: []
    };
    var setProvindeCityDistrict = function(data){ // 用于设置省市区
        if (parseInt(data.provinceCode, 10) > 0) {
            $scope.selectedPlace.provinceCode = data.provinceCode;
            $timeout(function() {
                if (parseInt(data.cityCode, 10) > 0) {
                    $scope.selectedPlace.cityCode = data.cityCode;
                    $timeout(function() {
                        if (parseInt(data.districtCode, 10) > 0) {
                            $scope.selectedPlace.blockCode = data.districtCode;
                        }
                    }, 50);
                }

            }, 50);
        }
    };

    //小区详情
    var getRentEstateInfo = function(opt, cb, cberr) {
            rentalHouseService.getAreaDetail(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        getRentEstateInfoHandler = function(data) {
            $scope.state.id = data.id;
            $scope.state.name = data.name;
            $scope.state.address = data.address;
            $scope.state.lat = data.lat;
            $scope.state.lng = data.lng;
            //初始化省市区
            $scope.selectedPlace.provinceCode = data.provinceCode;//省编号
            $timeout(function() {
                $scope.selectedPlace.cityCode = data.cityCode;
                $timeout(function() {
                    $scope.selectedPlace.blockCode = data.districtCode;
                }, 50);
            }, 50);
        };

    //添加修改小区
    var doRentEstateSave = function(opt, cb, cberr) {
            rentalHouseService.editArea(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        doRentEstateSaveHandler = function(data) {
            if(data && data['__state'] && data['__state'].code === 10200) {
                layer.alert(data['__state'].msg);
                getRentEstateList(ajaxParams, getRentEstateListHandler);
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
                //    layer.closeAll();
                    $rootScope.$state.go('save-house-order-list');
                //});
            }
        };

    var tankuan = setInterval(function () {
        if($rootScope.$state.current.name == 'area-management') {
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
            getRentEstateList(ajaxParams, getRentEstateListHandler);
        },
        goPrePage:function() { // 上一页
            if(paginData.currentPage > 1) {
                $scope.search.page = parseInt(paginData.currentPage, 10) - 1;
                ajaxParams.page = $scope.search.page;
                getRentEstateList(ajaxParams, getRentEstateListHandler);
            }
        },
        goNextPage:function() { // 下一页
            if(paginData.currentPage < paginData.lastPage) {
                $scope.search.page = parseInt(paginData.currentPage, 10) + 1;
                ajaxParams.page = $scope.search.page;
                getRentEstateList(ajaxParams, getRentEstateListHandler);
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
            getRentEstateList(ajaxParams, getRentEstateListHandler);
        },
        keyGoToPage:function(e) {
            var keyCode = +e.keyCode;
            if(keyCode === 13) {
                this.goToPage();
            }
        },
        doAdd:function() {
            var id = '';
            this.doEdit(id);
        },
        doEdit:function(id) {
            if(id==''){
                $scope.state.name = '';
                $scope.state.address = '';
                $scope.state.lat = '';
                $scope.state.lng = '';
                $scope.selectedPlace = {
                    provinceCode: '', //省编号
                    cityCode: '', //市编号
                    blockCode: '', //区/县编号
                    provinceName: '', //省名
                    cityName: '', //市名
                    blockName: '', //区/县名
                };
                $scope.state.isUpdate = false;
                console.log('111', $scope.state.isUpdate)
            }else{
                $scope.state.isUpdate = true;
                console.log('222', $scope.state.isUpdate)
                getRentEstateInfo({id:id},getRentEstateInfoHandler);
            }
            $scope.state.showEditList = true;//显示弹窗列表
            $timeout(function(){
                layer.open({
                    type: 1
                    ,title: false //不显示标题栏
                    ,closeBtn: false
                    ,area: ['680px','auto']//初始化Layer高度
                    ,shade: 0.8
                    ,btn: ['确定', '取消']
                    ,content: $('#addList')
                    ,yes: function(){
                        var postData = {
                            name:$scope.state.name,
                            address:$scope.state.address,
                            lat:$scope.state.lat,
                            lng:$scope.state.lng,
                            province:$scope.selectedPlace.provinceName,//省
                            city:$scope.selectedPlace.cityName,//市
                            district:$scope.selectedPlace.blockName,//区/县
                            provinceCode:$scope.selectedPlace.provinceCode,//省编号
                            cityCode:$scope.selectedPlace.cityCode,//市编号
                            districtCode:$scope.selectedPlace.blockCode,//区/县编号
                        };
                        if(id !=''){
                            postData.id = id;
                        }
                        if( !_validate.isRequired(postData.address)){
                            layer.alert('请选择详细地址');
                            return false;
                        }
                        if( !_validate.isRequired(postData.name)){
                            layer.alert('请输入小区名称');
                            return false;
                        }else{
                            doRentEstateSave(postData, doRentEstateSaveHandler);
                            $scope.state.showEditList = false;
                            layer.closeAll();
                        }
                    }
                    ,btn2: function(){
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
        openTankuang: function () {
            //打开弹窗
            $scope.state.isShowNewOrder = true;
            clearInterval(tankuan)
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
                        allIdx = null;
                        clearInterval(tankuan);
                        layer.closeAll();
                    }
                    ,btn2: function(){
                        $scope.state.isShowPinggu = false;
                        allIdx = null;
                        clearInterval(tankuan);
                        layer.closeAll();
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
