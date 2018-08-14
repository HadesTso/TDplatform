app.register.controller('save-house-order-detail', function ($scope,$rootScope,rentalHouseService,CommonService,$timeout,_validate) {
    
    'use strict';
    
	var ajaxParams = {
        id:$rootScope.$stateParams.id,
        };
    $scope.wuxiao = {
        id:ajaxParams.id,
        note :''
    }
    $scope.passPinggu = {
        id:ajaxParams.id,// 订单数据的id
        note :'',// 备注
        imgIds :'',//图片id，多个英文逗号分隔
        type :''// 30为改成评估，50改成签约
    }
    $scope.state = {
        shufflingFigure:[],//上传图片
        pageId:$rootScope.$stateParams.id,
        uploadImgFigure:[],//上传认购图片
        orderType:'',//订单状态
        isArrive:'',//判断是否到访
        isBaobei:false,//已报备
        isDaofang:false,//已到访
        isPinggu:false,//已评估
        isQianyue:false,//已签约
        isShixiao:false,//已失效

        isShowWuxiao:false,//是否显示判断无效的弹框
        isShowPinggu:false,//是否显示评估通过的弹框
        canAdd:true,//判断最多添加12张图片
    };
	var getSaveHouseOrderDetail = function(opt, cb, cberr) {
        rentalHouseService.getSaveHouseOrderDetail(opt)
            .then(function(data) {
                if (typeof cb === 'function') cb(data)
            }, function(data) {
                if (typeof cb === 'function') cberr(data)
            });
    },
    getSaveHouseOrderDetailHandler = function(data) {
    	console.log(data)
    	$scope.page = data;
        $scope.state.orderType = data.status;
        $scope.state.isArrive = data.arrive;
        console.log($scope.state.isArrive)
        if($scope.state.isArrive == 1){
            if($scope.state.orderType == 10){//已到访
                $scope.state.isDaofang = true;
            }
        }else if($scope.state.isArrive == 0){
            if($scope.state.orderType == 10){//已报备
                $scope.state.isBaobei = true;
            }

        }
        if($scope.state.orderType == 30){//已评估
            $scope.state.isPinggu = true;
        }
        if($scope.state.orderType == 50){//已签约
            $scope.state.isQianyue = true;
        }
        if($scope.state.orderType == 40 || $scope.state.orderType == 60){//已失效
            $scope.state.isShixiao = true;
        }
    };
    getSaveHouseOrderDetail(ajaxParams, getSaveHouseOrderDetailHandler);


    
    // --保存认购图片
    var doSaveHouseOrderUploadImg= function(opt, cb, cberr) {
        rentalHouseService.doSaveHouseOrderUploadImg(opt)
            .then(function(data) {
                if(typeof cb === 'function')cb(data);
            }, function(data) {
                if(typeof cberr === 'function')cberr(data);
            });
    },
    doSaveHouseOrderUploadImgHandler = function(data) {
    	layer.closeAll('loading');
        if(data && data['__state'] && data['__state'].code===10200) {
            layer.alert('保存成功', function(idx) {
                layer.close(idx);
                window.location.reload();
            });            
        }
    };

    // --更改为无效房
    var doWuxiao= function(opt, cb, cberr) {
            rentalHouseService.doWuxiao(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        doWuxiaoHandler = function(data) {
            layer.closeAll('loading');
            if(data && data['__state'] && data['__state'].code===10200) {
                layer.alert('保存成功', function(idx) {
                    layer.closeAll();
                    window.location.reload();
                    $scope.state.isShowWuxiao = false;
                });
            }
        };

    // --通过评估[type,30为改成评估，50改成签约]
    var passPinggu= function(opt, cb, cberr) {
            rentalHouseService.passPinggu(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        passPingguHandler = function(data) {
            layer.closeAll('loading');
            if(data && data['__state'] && data['__state'].code===10200) {
                layer.alert('保存成功', function(idx) {
                    layer.closeAll();
                    window.location.reload();
                    $scope.state.isShowPinggu = false;
                });
            }
        };

    //上传网签图片
    // 图片上传
    var uploadImg = function(opt, cb, cberr){
            var setting = {
                appid:4,
                useType:'project',
                base64File:''
            };
            CommonService.doUploadImg(angular.merge(setting, opt))
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        uploadBanner = function(data) { // 上传户型图片
            $scope.state.shufflingFigure.push(data);
            console.log($scope.state.shufflingFigure)
            if($scope.state.shufflingFigure.length>=12){
                $scope.state.canAdd = false;
            }
        };
    var getBanner = function(bannerArr) {
        var result = '';
        if(bannerArr && bannerArr.length) {
            for(var i = 0, len = bannerArr.length; i < len; i++) {
                result += ',' + bannerArr[i].imgId;
            }
        }
        if(result) {
            result = result.substring(1);
        }
        return result;
    };

    $scope.cb = {
        uploadImgBanner:function(data) {

            uploadImg({base64File:data} ,uploadBanner);
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
    }

    $scope.act = {
        //删除图片
        delBannerItem:function(item) {
            var idx = $scope.state.shufflingFigure.indexOf(item);
            if(idx > -1) {
                $scope.state.shufflingFigure.splice(idx,1);
            }
            $scope.state.canAdd = true;
        },
        //删除认购图片
        delUploadImg:function(item) {
            var idx = $scope.state.uploadImgFigure.indexOf(item);
            if(idx > -1) {
                $scope.state.uploadImgFigure.splice(idx,1);
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
                    })
                }
            });
        },
        //上传认购图片
        uploadImg:function() {
	    	$scope.state.showUploadImg = true;//显示弹窗列表
	    	$timeout(function(){
				layer.open({
			        type: 1
			        ,title: false //不显示标题栏
	    			,closeBtn: false
			        ,area: ['350px','auto']//初始化Layer高度
			        ,shade: 0.8
			        ,btn: ['保存', '取消']
			        ,content: $('#uploadImg')
			        ,yes: function(){
        				var postData = {};
        				postData.orderId = $rootScope.$stateParams.id;
        				postData.imgIds = getUploadImgId($scope.state.uploadImgFigure);
        				postData.note = $scope.state.note;
			        	if( !_validate.isRequired(postData.imgIds)){
			                layer.alert('请选择图片。');
			                return;
			            }
			        	if( !_validate.isRequired(postData.note)){
			                layer.alert('请填写备注。');
			                return;
			            }
			        	console.log(postData);
		            	doSaveHouseOrderUploadImg(postData, doSaveHouseOrderUploadImgHandler);
		            	$scope.state.showUploadImg = false;
		            	layer.closeAll();
					}
					,btn2: function(){
						$scope.state.uploadImgFigure = [];
					    $scope.state.showUploadImg = false;
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
        doWuxiao: function () {
            $scope.state.isShowWuxiao = true;//显示弹窗列表
            $timeout(function(){
                layer.open({
                    type: 1
                    ,title: false //不显示标题栏
                    ,closeBtn: false
                    ,area: ['350px','auto']//初始化Layer高度
                    ,shade: 0.8
                    ,btn: ['保存', '取消']
                    ,content: $('#isShowWuxiao')
                    ,yes: function(){
                        if( !_validate.isRequired($scope.wuxiao.note)){
                            layer.alert('请填写备评估不通过原因!');
                            return;
                        }
                        doWuxiao($scope.wuxiao, doWuxiaoHandler);
                        $scope.state.showUploadImg = false;
                        layer.closeAll();
                    }
                    ,btn2: function(){
                        $scope.state.isShowWuxiao = false;
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
        doPassPinggu: function () {
            $scope.state.isShowPinggu = true;//显示弹窗列表
            $timeout(function(){
                layer.open({
                    type: 1
                    ,title: false //不显示标题栏
                    ,closeBtn: false
                    ,area: ['500px','auto']//初始化Layer高度
                    ,shade: 0.8
                    ,btn: ['保存', '取消']
                    ,content: $('#isShowPinggu')
                    ,yes: function(){
                        if( !_validate.isRequired($scope.state.shufflingFigure)){
                            layer.alert('请上传评估表照片!');
                            return;
                        }
                        $scope.passPinggu.imgIds = getBanner($scope.state.shufflingFigure)
                        $scope.passPinggu.type = 30;//改为评估
                        passPinggu($scope.passPinggu, passPingguHandler);
                        $scope.state.isShowPinggu = false;
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
        doSureQianyue: function () {
            $scope.state.isShowPinggu = true;//显示弹窗列表
            $timeout(function(){
                layer.open({
                    type: 1
                    ,title: false //不显示标题栏
                    ,closeBtn: false
                    ,area: ['500px','auto']//初始化Layer高度
                    ,shade: 0.8
                    ,btn: ['保存', '取消']
                    ,content: $('#isShowPinggu')
                    ,yes: function(){
                        if( !_validate.isRequired($scope.state.shufflingFigure)){
                            layer.alert('请上传评估表照片!');
                            return;
                        }
                        $scope.passPinggu.imgIds = getBanner($scope.state.shufflingFigure)
                        $scope.passPinggu.type = 50;//改为签约
                        passPinggu($scope.passPinggu, passPingguHandler);
                        $scope.state.isShowPinggu = false;
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
    };
    
    var getUploadImgId = function(arr){
    	var result = '';
    	if(arr && arr.length){
    		for(var i=0;i<arr.length;i++){
	    		result += arr[i].imgId + ',';
	    	}
    	}
    	result = result.substring(0, result.length - 1); 
    	return result;
    }
    
    // 图片上传
    //var uploadImg = function(opt, cb, cberr){
    //        var setting = {
    //            appid:4,
    //            useType:'project',
    //            base64File:''
    //        };
    //        CommonService.doUploadImg(angular.merge(setting, opt))
    //            .then(function(data) {
    //                if(typeof cb === 'function')cb(data);
    //            }, function(data) {
    //                if(typeof cberr === 'function')cberr(data);
    //            });
    //    },
    //    uploadBanner = function(data) { // 上传户型图片
    //        $scope.state.uploadImgFigure.push(data);
    //        console.log($scope.state.uploadImgFigure);
    //    };
    //var getBanner = function(bannerArr) {
    //    var result = '';
    //    if(bannerArr && bannerArr.length) {
    //        for(var i = 0, len = bannerArr.length; i < len; i++) {
    //            result += ',' + bannerArr[i].imgId;
    //        }
    //    }
    //    if(result) {
    //        result = result.substring(1);
    //    }
    //    return result;
    //};
    //
    //$scope.cb = {
    //    uploadImgBanner:function(data) {
    //        uploadImg({base64File:data} ,uploadBanner);
    //    }
    //};
    
});