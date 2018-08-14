app.register.controller('look-house-list', function ($scope,$rootScope,$timeout,rentalHouseService,_validate) {
    'use strict';

    var ajaxParams = {
    	//qmmfRentHouseInfoId:$rootScope.$stateParams.id,
        houseId:$rootScope.$stateParams.id,
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
    };
    
    
    // 获取列表数据
    $scope.list = [];
    $scope.search = {
    	qmmfRentHouseInfoId:$rootScope.$stateParams.id,
        inputCurPage:'' // 分页用
    };
    var getRentOrderList = function(opt, cb, cberr) {
        rentalHouseService.getLookHouseList(opt)
            .then(function(data) {
                if(typeof cb === 'function')cb(data);
            }, function(data) {
                if(typeof cberr === 'function')cberr(data);
            });
    },
    getRentOrderListHandler = function(data) {
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

    getRentOrderList(ajaxParams, getRentOrderListHandler);

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
        goPrePage:function() { // 上一页
            if(paginData.currentPage > 1) {
                $scope.search.page = parseInt(paginData.currentPage, 10) - 1;
                ajaxParams.page = $scope.search.page;
                getRentOrderList(ajaxParams, getRentOrderListHandler);
            }
        },
        goNextPage:function() { // 下一页
            if(paginData.currentPage < paginData.lastPage) {
                $scope.search.page = parseInt(paginData.currentPage, 10) + 1;
                ajaxParams.page = $scope.search.page;
                getRentOrderList(ajaxParams, getRentOrderListHandler);
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
            getRentOrderList(ajaxParams, getRentOrderListHandler);
        },
        keyGoToPage:function(e) {
            var keyCode = +e.keyCode;
            if(keyCode === 13) {
                this.goToPage();
            }
        },
    };
});
