app.register.controller('rent-user-list', function ($scope,$rootScope,$timeout,rentalHouseService,_validate) {
    'use strict';

    var ajaxParams = {
    	qmmfRentHouseInfoId:$rootScope.$stateParams.id,
        rentName:'',
        rentMobile:'',
        sendUserName:'',
        sendUserMobile:'',
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
        jumpId:$rootScope.$stateParams.id,
    };
    
    
    // 获取列表数据
    $scope.list = [];
    $scope.search = {
    	qmmfRentHouseInfoId:$rootScope.$stateParams.id,
        rentName:'',
        rentMobile:'',
        sendUserName:'',
        sendUserMobile:'',
        startTime:'',
        endTime:'',
        inputCurPage:'' // 分页用
    };
    var getRentUserList = function(opt, cb, cberr) {
        rentalHouseService.getRenterList(opt)
            .then(function(data) {
                if(typeof cb === 'function')cb(data);
            }, function(data) {
                if(typeof cberr === 'function')cberr(data);
            });
    },
    getRentUserListHandler = function(data) {
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

    getRentUserList(ajaxParams, getRentUserListHandler);

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
            getRentUserList(ajaxParams, getRentUserListHandler);
        },
        goPrePage:function() { // 上一页
            if(paginData.currentPage > 1) {
                $scope.search.page = parseInt(paginData.currentPage, 10) - 1;
                ajaxParams.page = $scope.search.page;
                getRentUserList(ajaxParams, getRentUserListHandler);
            }
        },
        goNextPage:function() { // 下一页
            if(paginData.currentPage < paginData.lastPage) {
                $scope.search.page = parseInt(paginData.currentPage, 10) + 1;
                ajaxParams.page = $scope.search.page;
                getRentUserList(ajaxParams, getRentUserListHandler);
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
            getRentUserList(ajaxParams, getRentUserListHandler);
        },
        keyGoToPage:function(e) {
            var keyCode = +e.keyCode;
            if(keyCode === 13) {
                this.goToPage();
            }
        },
        rotateImg:function(src){
            var posterImg = new Image();
            posterImg.src = src;
            var size = getSize(posterImg.width,posterImg.height);
            //打开弹窗
            layer.open({
                type: 1,
                shade: 0.3,
                shadeClose: true,
                title: false,
                closeBtn: 2,
                move: '.layui-layer-content',
                skin: 'bm-upload-img-super',
                content: '<span>' + src + '</span><img id="rotateImg" src="' + src +'?v='+ Date.now() +'"/>',
                area: [size[0] + 'px', size[1] + 'px'],
                success: function(layero){
                    var i = 0;
                    $('#rotateImg').on('mousedown', function(){
                        i += 90;
                        $('#rotateImg').css('transform','rotate(' + i + 'deg) translate(-50%,-50%)');
                        $('#rotateImg').css('transform-origin','0% 0%');
                    });
                }
            });
        },
        showDetail:function(item) {
    		$scope.state.shufflingFigure = item;
    		$scope.state.showEditList = true;
	    	$timeout(function(){
				layer.open({
			        type: 1
			        ,title: false //不显示标题栏
	    			,closeBtn: false
			        ,area: ['370px','auto']//初始化Layer高度
			        ,shade: 0.8
			        ,btn: ['确定']
			        ,content: $('#addList')
			        ,yes: function(){
        				$scope.state.showEditList = false;
			            layer.closeAll();
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
	    }
    };
    
    var getSize = function(w,h){
        var $win = $(window);
        var widthW = parseInt($win.width() * 0.8);
        widthW = (widthW % 2 == 0) ? widthW : widthW + 1;
        var heightW = parseInt($win.height() * 0.8);
        heightW = (heightW % 2 == 0) ? heightW : heightW + 1;
        var width = w;
        var height = h;
        var size = [width, height];
        //图片宽高比比窗口宽，按宽度计算
        if (width / height >= widthW / heightW) {
            if (width > widthW) {
                size[0] = parseInt(widthW);
                size[1] = parseInt(height / width * widthW);
            }
        }
        //图片宽高比比窗口高，按高度计算
        else {
            if (height > heightW) {
                size[0] = parseInt(width / height * heightW);
                size[1] = parseInt(heightW);
            }
        };
        return size;
    };
});
