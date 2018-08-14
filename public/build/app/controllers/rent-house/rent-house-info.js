app.register.controller('rent-house-info', function ($scope,$rootScope,rentalHouseService,CommonService,$timeout,_validate) {
    
    'use strict';
    var id = $rootScope.$stateParams.id;
    $scope.urlId = id;
    $scope.postData = {//
        imgIds:'',//图片id，多个用英文逗号隔开
        qmmfRentHouseInfoId:'',// 房源id
        rentName:'',//租客姓名
        rentMobile:'',//租客手机号
        startTime:'',//租客的租期开始时间
        endTime:'',//租客的租期结束时间
        rentStatus:'',// 出租状态 0为待出租 1为出租
    }

    //小区下拉框数据
    var getRentEstateDownList = function(opt, cb, cberr) {
            rentalHouseService.getRentEstateDownList(opt)
            .then(function(data) {
                if (typeof cb === 'function') cb(data)
            }, function(data) {
                if (typeof cb === 'function') cberr(data)
            });
    },
    getRentEstateDownListHandler = function(data) {
    	$scope.rentEstateDownList = data;
    }
	getRentEstateDownList({type:$rootScope.$stateParams.type},getRentEstateDownListHandler);
	
	//选择小区点击事件
    $scope.rentEstateGetId = function(){
    	var item = null;
    	for(var i = 0, len = $scope.rentEstateDownList.length; i < len; i++) {
            if($scope.rentEstateDownList[i].id == $scope.send.qmmfRentEstateId){
                item = $scope.rentEstateDownList[i];
            }
        }
    	if(item != null){
    		//初始化省市区
		    $scope.selectedPlace.provinceCode = item.provinceCode;//省编号
		    $timeout(function() {
	            $scope.selectedPlace.cityCode = item.cityCode;
	            $timeout(function() {
	                $scope.selectedPlace.blockCode = item.districtCode;
	            }, 50);
	        }, 50);
            $scope.send.estateAddress = item.address;
        }
        console.log(item);
        console.log($scope.send.qmmfRentEstateId)
        checkArea({estateId:$scope.send.qmmfRentEstateId},checkAreaHandler)
	}
	
	//租房订单下拉框数据
    //var getRentOrderDownList = function(opt, cb, cberr) {
     //   rentalHouseService.getRentOrderDownList(opt)
     //       .then(function(data) {
     //           if (typeof cb === 'function') cb(data)
     //       }, function(data) {
     //           if (typeof cb === 'function') cberr(data)
     //       });
    //},
    //getRentOrderDownListHandler = function(data) {
    	//$scope.rentOrderDownList = data;
    //}
	//getRentOrderDownList({type:$rootScope.$stateParams.type},getRentOrderDownListHandler);
	//
	
	//选择订单点击事件
    $scope.rentOrderGetId = function(){
    	var item = null;
    	for(var i = 0, len = $scope.rentOrderDownList.length; i < len; i++) {
            if($scope.rentOrderDownList[i].id == $scope.send.qmmfSaveHouseOrderId){
                item = $scope.rentOrderDownList[i];
            }
        }
    	if(item != null){
    		//初始化房东名称、电话
        	$scope.send.ownerName = item.ownerName;
        	$scope.send.ownerMobile = item.ownerMobile;
    	}
	}
    
    if(id == ''){
        $scope.editStatus = false;
        $scope.send = {
        	ownerName:'',
	    	ownerMobile:'',
        	qmmfSaveHouseOrderId:'',
	    	qmmfRentEstateId:'',
        	estateAddress:'',
	    	title:'',
        	buildingRoom:'',
	    	monthMoney:'',
        	jianfangEndTime:'',
	    	jianfangStartTime:'',
        	decoration:'简单装修',
	    	decade:'',
	    	orientation:'',
        	floor:'',
	    	moneyType:'',
	    	houseDool:'',
	    	area:'',
        	note:'',
	    	houseSituation:'',
            type:''
	    };
    }else{
    	$scope.editStatus = true;
    	var ajaxParams = {
	        id:$rootScope.$stateParams.id,
	    }
    	
		
		var getRentHouseInfo = function(opt, cb, cberr) {
            rentalHouseService.getRentHouseInfo(opt)
	            .then(function(data) {
	                if (typeof cb === 'function') cb(data)
	            }, function(data) {
	                if (typeof cb === 'function') cberr(data)
	            });
	    },
	    getRentHouseInfoHandler = function(data) {
	        $scope.send = {
	        	id:data.id,
	        	ownerName:data.ownerName,
		    	ownerMobile:data.ownerMobile,
	        	qmmfSaveHouseOrderId:data.qmmfSaveHouseOrderId,
	        	orderSn:data.orderSn,
		    	qmmfRentEstateId:data.qmmfRentEstateId,
	        	estateAddress:data.estateAddress,
		    	title:data.title,
	        	buildingRoom:data.buildingRoom,
		    	monthMoney:data.monthMoney,
	        	jianfangEndTime:data.jianfangEndTime,
		    	jianfangStartTime:data.jianfangStartTime,
	        	decoration:data.decoration,
		    	decade:data.decade,
		    	orientation:data.orientation,
	        	floor:data.floor,
		    	moneyType:data.moneyType,
		    	houseDool:data.houseDool,
		    	area:data.area,
	        	note:data.note,
		    	houseSituation:data.houseSituation,
		    	rentStatus:data.rentStatus,
		    	type:data.type,

		    };
		    //初始化房屋配置
	        if(data.imgIds && data.imgIds.length){
	        	houseConfigureInit(data.houseConfigure.split(','));
	        }
		    //初始化省市区
		    $scope.selectedPlace.provinceCode = data.estateProvinceCode;//省编号
		    $timeout(function() {
                $scope.selectedPlace.cityCode = data.estateCityCode;
                $timeout(function() {
                    $scope.selectedPlace.blockCode = data.estateDistrictCode;
                }, 50);
            }, 50);
            //初始化房屋图片
	        if(data.imgIds && data.imgIds.length){
	        	$scope.state.shufflingFigure = data.imgIds;
	        }
	    };
	    getRentHouseInfo(ajaxParams, getRentHouseInfoHandler);
    }
	// 房屋配置
    $scope.houseTypeList = [
        {name:'床',key:'1',checked:false},
        {name:'洗衣机',key:'2',checked:false},
        {name:'空调',key:'3',checked:false},
        {name:'冰箱',key:'4',checked:false},
        {name:'可做饭',key:'5',checked:false},
        {name:'电视机',key:'6',checked:false},
        {name:'热水器',key:'7',checked:false},
        {name:'宽带',key:'8',checked:false},
        {name:'沙发',key:'9',checked:false},
        {name:'暖气',key:'10',checked:false},
        {name:'衣柜',key:'11',checked:false},
        {name:'卫生间',key:'12',checked:false},
        {name:'阳台',key:'13',checked:false},
    ];
    
    var houseConfigureInit = function(arr) {
        if(arr && arr.length) {
            for(var i = 0, len = arr.length; i < len; i++) {
                for(var j = 0, len = $scope.houseTypeList.length; j < len; j++) {
		            if($scope.houseTypeList[j].key == arr[i]) {
		                $scope.houseTypeList[j].checked = true;
		            }
		        }
            }
        }
    };
    
    var getHouseConfigureType = function(arr) {
    	
        var result = '';
        if(arr && arr.length){
            for(var i = 0, len = arr.length; i < len; i++) {
                var tempItem = arr[i];
                if(tempItem.checked){
                    result += ',' + tempItem.key;
                }
            }
        }
        if(result) {
            result = result.substring(1);
        }
        return result;
    };

    // --检查小区
    var checkArea= function(opt, cb, cberr) {
            rentalHouseService.checkArea(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        checkAreaHandler = function(data) {
            layer.closeAll('loading');
            if(data && data['__state'] && data['__state'].code===10200) {
                //layer.alert('保存成功', function(idx) {
                //    layer.closeAll();
                //    window.location.reload();
                //    $scope.state.isShowPinggu = false;
                //});
            }else{
                layer.alert("该小区未获取定位，请到小区管理中完善!")
                return false;
            }
        };


    $scope.state = {
    	shufflingFigure:[],//上传图片
    	shufflingFigure2:[],//上传弹框上的图片
    	pageId:$rootScope.$stateParams.id,
        isShowChangeType:false,//是否显示弹框
        isShowChangeType2:false,//是否显示弹框
	};
    
    
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
        },
        uploadBanner2 = function(data) { // 上传弹框户型图片
            $scope.state.shufflingFigure2.push(data);
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
        },
        uploadImgBanner2:function(data) {
            uploadImg({base64File:data} ,uploadBanner2);
        }
    };
    
    
    // -- 保存
    var doRentHouseSave = function(opt, cb, cberr) {
        rentalHouseService.doRentHouseSave(opt)
            .then(function(data) {
                if(typeof cb === 'function')cb(data);
            }, function(data) {
                if(typeof cberr === 'function')cberr(data);
            });
    },
    doRentHouseSaveHandler = function(data) {
        if(data && data['__state'] && data['__state'].code === 10200) {
        	layer.alert(data['__state'].msg, function(idx) {
                layer.close(idx);
	            $rootScope.$state.go('rent-house-list',{id:''});
            });
        }
    };

    // -- 更改房源状态
    var updateStatus = function(opt, cb, cberr) {
            rentalHouseService.updateStatus(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        updateStatusHandler = function(data) {
            if(data && data['__state'] && data['__state'].code === 10200) {
                layer.alert(data['__state'].msg, function(idx) {
                    layer.closeAll();
                    $rootScope.$state.go('rent-house-list',{id:''});
                });
            }
            $scope.state.isShowChangeType = false;//显示弹窗列表
            $scope.state.isShowChangeType2 = false;//显示弹窗列表
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
    $scope.act = {
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
    	//删除图片
        delBannerItem:function(item) {
            var idx = $scope.state.shufflingFigure.indexOf(item);
            if(idx > -1) {
                $scope.state.shufflingFigure.splice(idx,1);
            }
        },
        //删除图片
        delBannerItem2:function(item) {
            var idx = $scope.state.shufflingFigure2.indexOf(item);
            if(idx > -1) {
                $scope.state.shufflingFigure2.splice(idx,1);
            }
        },
        doSave: function() {
            var ajaxParams = {
	        	id:$scope.send.id,
	        	ownerName:$scope.send.ownerName,
		    	ownerMobile:$scope.send.ownerMobile,
	        	//qmmfSaveHouseOrderId:$scope.send.qmmfSaveHouseOrderId,
		    	qmmfRentEstateId:$scope.send.qmmfRentEstateId,
	        	estateAddress:$scope.send.estateAddress,
		    	title:$scope.send.title,
	        	buildingRoom:$scope.send.buildingRoom,
		    	monthMoney:$scope.send.monthMoney,
	        	jianfangEndTime:$scope.send.jianfangEndTime,
		    	jianfangStartTime:$scope.send.jianfangStartTime,
	        	decoration:$scope.send.decoration,
		    	decade:$scope.send.decade,
		    	orientation:$scope.send.orientation,
	        	floor:$scope.send.floor,
		    	moneyType:$scope.send.moneyType,
		    	houseDool:$scope.send.houseDool,
		    	area:$scope.send.area,
	        	note:$scope.send.note,
	        	houseConfigure:getHouseConfigureType($scope.houseTypeList),
		    	houseSituation:$scope.send.houseSituation,
		    	
		    	province:$scope.selectedPlace.provinceName,//省
		    	city:$scope.selectedPlace.cityName,//市
		    	district:$scope.selectedPlace.blockName,//区/县
		    	provinceCode:$scope.selectedPlace.provinceCode,//省编号
		    	cityCode:$scope.selectedPlace.cityCode,//市编号
		    	districtCode:$scope.selectedPlace.blockCode,//区/县编号
		    	type:$scope.send.type,//区/县编号

            };
            if($scope.state.shufflingFigure && $scope.state.shufflingFigure.length){
            	ajaxParams.img = $scope.state.shufflingFigure[0].url;
		    	ajaxParams.imgIds = getBanner($scope.state.shufflingFigure);
            }
            /*if( !_validate.isRequired(ajaxParams.branchBankName) || 
                !_validate.isRequired(ajaxParams.address) || 
                !_validate.isRequired(ajaxParams.intro) || 
                !_validate.isRequired(ajaxParams.housingStandard) || 
                !_validate.isRequired(ajaxParams.commissionNote)
            ){
                layer.alert('请填写完整表单。');
                return false;
            }*/
            if($scope.state.shufflingFigure && $scope.state.shufflingFigure.length == 0){
	        	layer.alert('请上传房屋详情图。');
                return;
	        }
            else{
	            console.log(ajaxParams);
            	if(id != ''){
                    ajaxParams.id = $rootScope.$stateParams.id;
	            	doRentHouseSave(ajaxParams, doRentHouseSaveHandler);
	            }else{
	            	doRentHouseSave(ajaxParams, doRentHouseSaveHandler);
	            }
        	}
        },
        changeType: function (rentStatus,ids) {
            $scope.postData.qmmfRentHouseInfoId = ids;// 房源id
            if(rentStatus == 1){
                $scope.postData.imgIds='';//图片id，多个用英文逗号隔开
                $scope.postData.rentName='';//租客姓名
                $scope.postData.rentMobile='';//租客手机号
                $scope.postData.startTime='';//租客的租期开始时间
                $scope.postData.endTime='';//租客的租期结束时间
                $scope.postData.rentStatus=0;// 出租状态 0为待出租 1为出租
                $scope.state.isShowChangeType2 = true;//显示弹窗列表
                $timeout(function(){
                    layer.open({
                        type: 1
                        ,title: false //不显示标题栏
                        ,closeBtn: false
                        ,area: ['420px','auto']//初始化Layer高度
                        ,shade: 0.8
                        ,btn: ['确定', '取消']
                        ,content: $('#changeType2')
                        ,yes: function(){

                            updateStatus($scope.postData, updateStatusHandler);
                        }
                        ,btn2: function(){
                            $scope.state.isShowChangeType = false;
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
            }else{
                $scope.postData.rentStatus = 1;
                $scope.state.isShowChangeType = true;//显示弹窗列表
                console.log($scope.postData.imgIds)
                $timeout(function(){
                    layer.open({
                        type: 1
                        ,title: false //不显示标题栏
                        ,closeBtn: false
                        ,area: ['420px','auto']//初始化Layer高度
                        ,shade: 0.8
                        ,btn: ['确定', '取消']
                        ,content: $('#changeType')
                        ,yes: function(){
                            if($scope.state.shufflingFigure2 && $scope.state.shufflingFigure2.length){
                                //$scope.postData.img = $scope.state.shufflingFigure2[0].url;
                                $scope.postData.imgIds = getBanner($scope.state.shufflingFigure2);
                            }
                            if($scope.state.shufflingFigure && $scope.state.shufflingFigure.length == 0){
                                layer.alert('请上传房屋详情图。');
                                return;
                            }

                            if( !_validate.isRequired($scope.postData.rentName)){
                                layer.alert('租客姓名不能为空！');
                                return false;
                            }
                            if( !_validate.isRequired($scope.postData.rentMobile)){
                                layer.alert('租客手机号不能为空！');
                                return false;
                            }
                            if( !_validate.isRequired($scope.postData.startTime)){
                                layer.alert('出租开始时间不能为空！');
                                return false;
                            }
                            if( !_validate.isRequired($scope.postData.endTime)){
                                layer.alert('出租结束时间不能为空！');
                                    return false;
                            }

                            updateStatus($scope.postData, updateStatusHandler);
                        }
                        ,btn2: function(){
                            $scope.state.isShowChangeType = false;
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
    
});