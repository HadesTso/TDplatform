app.register.controller('mymanagement-list', function ($scope, $timeout, MyProjectService, _validate) {

    'use strict';

    var ajaxParams = {
        projectName:'',
        city:'',
        district:'',
        status:'-1',
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
    $scope.state = {
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
        projectName:'',
        city:'',
        district:'',
        status:'-1',
        page:'1'
    };
    var getKojiProjectList = function(opt, cb, cberr) {
        MyProjectService.getKojiProjectList(opt)
            .then(function(data) {
                if(typeof cb === 'function')cb(data);
            }, function(data) {
                if(typeof cberr === 'function')cberr(data);
            });
    },
    getKojiProjectListHandler = function(data) {
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

    getKojiProjectList(ajaxParams, getKojiProjectListHandler);


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
            getKojiProjectList(ajaxParams, getKojiProjectListHandler);
        },
        doExport: function () {
            window.location.href="/admin/project/project-list-export?project_id="+ajaxParams.projectId+"&&project_name="+ajaxParams.projectName+"&&city="+ajaxParams.city+"&&district="+ajaxParams.district+"&&is_recommend="+ajaxParams.isRecommend+"&&is_collaborate="+ajaxParams.isCollaborate
            //doExport(ajaxParams,doExportHandler)
        },
        goPrePage:function() { // 上一页
            if(paginData.currentPage > 1) {
                $scope.search.page = parseInt(paginData.currentPage, 10) - 1;
                ajaxParams.page = $scope.search.page;
                getKojiProjectList(ajaxParams, getKojiProjectListHandler);
            }
        },
        goNextPage:function() { // 下一页
            if(paginData.currentPage < paginData.lastPage) {
                $scope.search.page = parseInt(paginData.currentPage, 10) + 1;
                ajaxParams.page = $scope.search.page;
                getKojiProjectList(ajaxParams, getKojiProjectListHandler);
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
            getKojiProjectList(ajaxParams, getKojiProjectListHandler);
        },
        keyGoToPage:function(e) {
            var keyCode = +e.keyCode;
            if(keyCode === 13) {
                this.goToPage();
            }
        }
    };    
});