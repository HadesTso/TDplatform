app.register.controller('mymanagement-info', function ($rootScope, $scope, $timeout, MyProjectService, CommonService, _tools, _validate) {

    'use strict';

    var id = parseInt($rootScope.$stateParams.id);
    var status = parseInt($rootScope.$stateParams.status);//-2 代表示修改佣金入口进来的
    $scope.state = {
        id: id?id:'', // 楼盘id
        isUpdate:(id > 0), // 大于0为更新
        isDisabledAll: false, // 是否禁用所有输入框
        showMap:false, // 是否显示地图
        isLoading:false,//是否加载中
        status:status,
    };

    // 发送出去的数据
    $scope.send = {
        id: '',
        projectName: '',
        projectType: '',
        priceScope: '',
        province: '',
        provinceCode: '',
        city: '',
        cityCode: '',
        district: '',
        districtCode: '',
        // address: '',
        startTime: '',
        endTime: '',
        qmmfProjectResourceIds: '',
        commission: '',
        preferentialPolicy:'',
        projectIntro:'',
        shufflingFigure:[],
        projectCommissionArr: [],
        commissionExplain: ''
    };
    var ajaxParams = {
        id: '',
        projectName: '',
        projectType: '',
        priceScope: '',
        province: '',
        provinceCode: '',
        city: '',
        cityCode: '',
        district: '',
        districtCode: '',
        // address: '',
        startTime: '',
        endTime: '',
        qmmfProjectResourceIds: '',
        commission: '',
        preferentialPolicy:'',
        projectIntro:'',
        shufflingFigure:[],
        projectCommissionArr: '',
        commissionExplain: ''
    };

    // 获取楼盘类型数据 // TODO:DEL 现在写死
    $scope.projectTypeList = [
        {name:'住宅',checked:false},
        {name:'别墅',checked:false},
        {name:'写字楼',checked:false},
        {name:'公寓',checked:false},
        {name:'商铺',checked:false},
        {name:'其他',checked:false}
    ];
    // 把projectType选中 target->$scope.projectTypeList， source->$scope.pageData获取回来info
    var compareSelectedProjectList = function(target, source) {
        var sourceList = source?source.split(','):[];
        if(sourceList && sourceList.length) {
            for(var i = 0, leni = sourceList.length; i < leni; i++) {
                for(var j = 0, lenj = target.length; j < lenj; j++) {
                    if(target[j].name === sourceList[i]) {
                        target[j].checked = true;
                    }
                }
            }
        }
    };
    var getNumTypeNShowType = function(projectType) { // 获取选中的楼盘类型字符串
        var result = '',
            tempItem = null;
        if(projectType && projectType.length) {
            for(var i = 0, len = projectType.length; i < len; i++) {
                tempItem = projectType[i];
                if(tempItem.checked) {
                    result += ',' + tempItem.name;
                }
            }
            if(result) {
                result = result.substring(1);
            }
        }
        return result;
    };

    //----------------------------添加楼盘佣金-------------------------
    $scope.btnAddType = function(){
        $scope.send.projectCommissionArr.push({
            projectType:'住宅',
            commissionType:'11',
            commissionContent:[
                {
                    title:'',
                    beforeNum:'',
                    beforeNumType:'%/套',
                    beforeCashPrize:'',
                    afterNum:'',
                    afterNumType:'%/套',
                    afterCashPrize:'',
                }
            ]
        });
    };
    //删除佣金展示
    $scope.btnDeleteType = function(id){
        $scope.send.projectCommissionArr.splice(id,1);
    };
    //添加跳转
    $scope.btnAddJump = function(item){
        item.commissionContent.push({
            title:'',
            beforeNum:'',
            beforeNumType:'%/套',
            beforeCashPrize:'',
            afterNum:'',
            afterNumType:'%/套',
            afterCashPrize:'',
        });
    };
    //删除跳转
    $scope.btnDeleteJump = function(item,id){
        item.commissionContent.splice(id,1);
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

    // 获取楼盘下的所有配置项
    var getKojiProjectInfo = function(opt, cb, cberr) {
        MyProjectService.getKojiProjectInfo(opt)
            .then(function(data) {
                if(typeof cb === 'function')cb(data);
            }, function(data) {
                if(typeof cberr === 'function')cberr(data);
            });
    },
    getKojiProjectInfoHandler = function(data){
        $scope.pageData = data;
        setSendModelData(data);
    },
    setSendModelData = function(data) {
        $scope.send.id =  data.id;
        $scope.send.canEdit =  data.canEdit;
        $scope.send.projectName =  data.projectName;
        $scope.send.projectType =  data.projectType;
        compareSelectedProjectList($scope.projectTypeList, $scope.send.projectType);
        $scope.send.priceScope =  data.priceScope;
        $scope.send.province =  data.province;
        $scope.send.provinceCode =  data.provinceCode;
        $scope.send.city =  data.city;
        $scope.send.cityCode =  data.cityCode;
        $scope.send.district =  data.district;
        $scope.send.districtCode =  data.districtCode;
        // $scope.send.address =  data.address;
        $scope.send.startTime =  data.startTime;
        $scope.send.endTime =  data.endTime;
        $scope.send.qmmfProjectResourceIds =  data.qmmfProjectResourceIds;
        $scope.send.commission =  data.commission;
        $scope.send.preferentialPolicy =  data.preferentialPolicy;
        $scope.send.projectIntro =  data.projectIntro;
        $scope.send.shufflingFigure =  data.shufflingFigure;
        $scope.send.saleLevel =  data.saleLevel;
        $scope.send.saleCompany =  data.saleCompany;
        setProvindeCityDistrict({
            provinceCode: data.provinceCode,
            cityCode: data.cityCode,
            districtCode: data.districtCode
        });
        $scope.send.projectCommissionArr = data.projectCommissionArr ? _tools.transKeyName('camel', JSON.parse(data.projectCommissionArr)) : [];
        $scope.send.commissionExplain = data.commissionExplain;
        if(data.projectResource && data.projectResource.length) {
            $scope.fileList = data.projectResource;
        }
        $scope.state.isDisabledAll = (data.status == '0');
    };

    // 删除楼盘资源包
    var doFileDelete = function(opt, cb, cberr) {
        CommonService.doFileDelete(opt)
            .then(function(data) {
                if(typeof cb === 'function')cb(data);
            }, function(data) {
                if(typeof cberr === 'function')cberr(data);
            });
    };
    var getResourceIds = function(list){
        var data = '';
        for(var i = 0; i < list.length ; i++){
            data += list[i].id + ','
        }
        data = data.substring(0,data.length-1);
        return data;
    };
    $scope.fileList = [];  
    var file,fileName = null,hostName = window.location.host,base = '';// 上传楼盘资源包
    if(!jQuery.handleError){jQuery.handleError = function(a, b, c, d) {
        console.log(a, b, c, d);
    };}
    $scope.fileChange = function(){
        file = document.getElementById('report');
        fileName = file.files[0].name;
        var postData = {};
        // postData.project_id = projectId;
        //表单验证
        if(fileName == null){
            layer.alert('请选择文件。');
            return;
        }else{
            $.ajaxFileUpload({
                type: 'post',
                url: base +'/common/up-project-files', //用于文件上传的服务器端请求地址
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'report', //文件上传域的ID
                dataType: 'json', //返回值类型 一般设置为json
                data:postData,
                success: function(data, status) { //服务器成功响应处理函数
                    //重置input_file
                    file = document.getElementById('report');
                    file.outerHTML = file.outerHTML;
                    fileName = null;
                    if(data.state && data.state.code === 10200) {
                        var tempData = _tools.transKeyName('camel', data.data);
                        $scope.fileList.push(tempData);
                        if (!$scope.$$phase) {
                              $scope.$apply();
                        }
                        console.log($scope.fileList);
                    }else{
                        if(data.state && data.state.msg) {
                            layer.alert(data.state.msg);
                        }
                    }
                },
                error: function(data, status, e) { //服务器响应失败处理函数
                    layer.alert(e);
                }
            });
        }        
    };

    // 提交最终数据
    var doSaveProject = function(opt, cb, cberr) {
        MyProjectService.doSaveProject(opt)
            .then(function(data) {
                if(typeof cb === 'function')cb(data);
            }, function(data) {
                if(typeof cberr === 'function')cberr(data);
            });
    },
    doSaveProjectHandler = function(data) {
        if (data && data['__state'] && data['__state'].msg) {
            var idx = layer.alert(data['__state'].msg, function() {
                $rootScope.$state.go('mymanagement-list');
                layer.close(idx);
            });
        }
    };

    // 如果是数据更新，先获取一遍数据
    if($scope.state.isUpdate) {
        getKojiProjectInfo({
            id:$scope.state.id
        },getKojiProjectInfoHandler);
    }else{
        // $scope.withCustomerTypeList[0].checked = true;
    }

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
            $scope.send.shufflingFigure.push(data);
            console.log($scope.send.shufflingFigure)
        };

    $scope.cb = {
        uploadImgBanner:function(data) {
            uploadImg({base64File:data} ,uploadBanner);
        }
    };
    $scope.act = {
        doSubmit:function() {
            if($scope.state.isUpdate) { // 更新就需要传id
                ajaxParams.id = $scope.state.id;
            }
            ajaxParams.projectName = $scope.send.projectName;
            ajaxParams.projectType = getNumTypeNShowType($scope.projectTypeList);
            ajaxParams.priceScope = $scope.send.priceScope;
            ajaxParams.province = $scope.selectedPlace.provinceName;
            ajaxParams.provinceCode = $scope.selectedPlace.provinceCode;
            ajaxParams.city = $scope.selectedPlace.cityName;
            ajaxParams.cityCode = $scope.selectedPlace.cityCode;
            ajaxParams.district = $scope.selectedPlace.blockName;
            ajaxParams.districtCode = $scope.selectedPlace.blockCode;
            // ajaxParams.address = $scope.send.address;
            ajaxParams.startTime = $scope.send.startTime;
            ajaxParams.endTime = $scope.send.endTime;
            ajaxParams.qmmfProjectResourceIds = getResourceIds($scope.fileList);
            ajaxParams.commission = $scope.send.commission;
            ajaxParams.preferentialPolicy = $scope.send.preferentialPolicy;
            ajaxParams.projectIntro = $scope.send.projectIntro;
            ajaxParams.saleLevel = $scope.send.saleLevel;
            ajaxParams.saleCompany = $scope.send.saleCompany;
            ajaxParams.projectCommissionArr = $scope.send.projectCommissionArr.length ? 
                angular.toJson(_tools.transKeyName('underline', $scope.send.projectCommissionArr)) : '';
            ajaxParams.commissionExplain = $scope.send.commissionExplain;
            var str = '';
            for(var i=0; i<$scope.send.shufflingFigure.length; i++){
                str +=  $scope.send.shufflingFigure[i].imgId + ',';
            }
            ajaxParams.shufflingFigure = str.substring(0,str.length-1);

            if(!_validate.isRequired(ajaxParams.projectName)) {
                layer.alert('请输入楼盘');
                return;
            }

            if($scope.state.status != -2){
                if(!_validate.isRequired(ajaxParams.projectType)) {
                    layer.alert('至少选择1个楼盘类型');
                    return;
                }
                if(!_validate.isRequired(ajaxParams.provinceCode) || !_validate.isRequired(ajaxParams.cityCode) || !_validate.isRequired(ajaxParams.districtCode)) {
                    layer.alert('请把省市区选择完整');
                    return;
                }
                if(!_validate.isRequired(ajaxParams.priceScope)) {
                    layer.alert('请输入楼盘价格范围');
                    return;
                }
            }

            if(!_validate.isRequired(ajaxParams.startTime)) {
                layer.alert('请选择合作开始时间');
                return;
            }
            if(!_validate.isRequired(ajaxParams.endTime)) {
                layer.alert('请选择合作结束时间');
                return;
            }
            // if(!_validate.isRequired(ajaxParams.commission) || 
            //     (ajaxParams.commission && !$.trim($('<div>' + ajaxParams.commission + '</div>').text()))
            // ) {
            //     layer.alert('请输入佣金政策');
            //     return;
            // }
            // 保存数据
            doSaveProject(ajaxParams,doSaveProjectHandler);
        },
        doFileDelete: function(item){
            layer.confirm(
                '是否确认将文件【'+item.fileName+'】删除！'
            ,{
                btn: ['确定','取消'] //按钮
            }, function(){
                var postData = {};
                postData.id = item.id;
                doFileDelete(postData,function(data){
                    if(data && data['__state'] && data['__state'].code === 10200) {
                        layer.alert(data['__state'].msg);
                        if($scope.fileList.indexOf(item) >= 0) {
                            $scope.fileList.splice($scope.fileList.indexOf(item),1);
                        }
                    }
                });
            }, function(){});
        },
        dowmloadFile: function(item){
            window.location.assign("/common/down-load-files?file_path="+item.path+"&file_name="+item.fileName);
        },
        goBack: function() {
            window.history.go(-1);
        },
        showMap: function() {
            if(!id || (id && $scope.pageData.status != '0')){
                $scope.state.showMap = true;
            }
        },
        delBannerItem:function(item) {
            var idx = $scope.send.shufflingFigure.indexOf(item);
            if(idx > -1) {
                $scope.send.shufflingFigure.splice(idx,1);
            }
        },
        bannerMove:function(direction, item, idx) {
            if(direction == 'left') {
                if(idx === 0) return;

                if($scope.send.shufflingFigure.length > 0) {
                    $scope.send.shufflingFigure[idx] = $scope.send.shufflingFigure[idx - 1];
                    $scope.send.shufflingFigure[idx - 1] = item;
                }
            }

            if(direction == 'right') {
                if(idx === ($scope.send.shufflingFigure.length - 1)) return;

                if($scope.send.shufflingFigure.length > 0) {
                    $scope.send.shufflingFigure[idx] = $scope.send.shufflingFigure[idx + 1];
                    $scope.send.shufflingFigure[idx + 1] = item;
                }
            }

        },
    };
    
    
    
});
