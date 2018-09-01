app
// 服务：订单 中心服务
.factory('rentalHouseService',  function($q, _jsonp, _httpGet, _httpPost,_setting){

        //所有房源
    var urlRentHouseList = '/acjl-admin/rent-house/rent-house-list', // 所有房源-房源列表
        urlRentEstateDownList = '/acjl-admin/rent-house/rent-estate-dropdown', // 所有房源-小区下拉数据
        urlRenterList = '/acjl-admin/rent-house/rent-user-list', // 所有房源-小区下拉数据
        urlLookHouseList = '/acjl-admin/rent-house/order-rent-list', // 所有房源-看房列表
        urlRentHouseSave = '/acjl-admin/rent-house/add-edit', // 所有房源-房源添加与修改
        urlRentHouseInfo = '/acjl-admin/rent-house/rent-house-info', // 所有房源-房源详情
        urlUpdateStatus = '/acjl-admin/rent-house/update-status', // 所有房源-房源详情-更改房源状态

        urlSaveHouseOrderList = '/acjl-admin/save-order/data-list',//存房订单-存房订单列表
        urlSaveHouseOrderDetail = '/acjl-admin/save-order/data-info',//存房订单-存房订单详情
        urlDoWuxiao = '/acjl-admin/save-order/update-fail',//存房订单-状态更改为无效房
        urlPassPinggu = '/acjl-admin/save-order/upload-data',//存房订单-通过评估[type,30为改成评估，50改成签约]

        //小区管理
        urlAreaManagementList = '/acjl-admin/rent-house/rent-estate-list', // 小区管理-列表
        urlEditArea = '/acjl-admin/rent-house/rent-estate-edit', // 小区管理-添加小区
        urlGetAreaDetail = '/acjl-admin/rent-house/rent-estate-info', // 小区管理-小区详情
        urlCheckArea = '/acjl-admin/rent-house/estate-lat-lng',//检查小区是否有经纬度

        //检查是否有新的订单
        urlCheckNewOrder = '/acjl-admin/save-order/alert',//检查是否有新的订单
        urlCancleNewOrder = '/acjl-admin/save-order/cancel-alert',//取消新订单的提醒

        //二维码管理
        urlGetCodeList = '/acjl-admin/rent-house/ewm-list',//获取二维码批次表
        urlGetBatchCode = '/acjl-admin/rent-house/create-ewm-code',//批量获取二维码

         //基本信息
        urlGetQuertion = '/acjl-admin/rent-house/estate-questions',//获取提示回答信息
        urlDoQuertionSave = '/acjl-admin/rent-house/rent-estate-questions',//保存提示回答

        service = null;

    service = {
        getAreaManagementList: function(opt) { // 小区管理-列表
            var d = $q.defer();
            _httpGet(urlAreaManagementList, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        editArea: function(opt) { // 小区管理-添加小区
            var d = $q.defer();
            _httpGet(urlEditArea, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        getAreaDetail: function(opt) { // 小区管理-小区详情
            var d = $q.defer();
            _httpGet(urlGetAreaDetail, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        RentHouseList: function(opt) { // 小区管理-小区详情
            var d = $q.defer();
            _httpGet(urlRentHouseList, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        getRentEstateDownList: function(opt) { // 小区管理-小区详情
            var d = $q.defer();
            _httpGet(urlRentEstateDownList, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        checkArea: function(opt) { // 小区管理-检查小区是否有经纬度
            var d = $q.defer();
            _httpGet(urlCheckArea, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        getRenterList: function(opt) { // 所有房源-租客列表
            var d = $q.defer();
            _httpGet(urlRenterList, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        getLookHouseList: function(opt) { // 所有房源-看房列表
            var d = $q.defer();
            _httpGet(urlLookHouseList, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        doRentHouseSave: function(opt) {// 所有房源-房源添加与修改
            var d = $q.defer();
            _httpGet(urlRentHouseSave, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        getRentHouseInfo: function(opt) {// 所有房源-房源详情
            var d = $q.defer();
            _httpGet(urlRentHouseInfo, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        updateStatus: function(opt) {// 所有房源-房源详情
            var d = $q.defer();
            _httpPost(urlUpdateStatus, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        //--存房订单
        // 存房订单-订单列表
        getSaveHouseOrderList: function(opt) {
            var d = $q.defer();
            _httpPost(urlSaveHouseOrderList, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        //--存房订单详情
        getSaveHouseOrderDetail: function(opt) {
            var d = $q.defer();
            _httpPost(urlSaveHouseOrderDetail, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        doWuxiao: function(opt) {
            var d = $q.defer();
            _httpPost(urlDoWuxiao, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        passPinggu: function(opt) {
            var d = $q.defer();
            _httpPost(urlPassPinggu, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },

        //--检查是否有新订单
        checkNewOrder: function(opt) {
            var d = $q.defer();
            _httpPost(urlCheckNewOrder, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        cancleNewOrder: function(opt) {//取消新订单的提醒
            var d = $q.defer();
            _httpPost(urlCancleNewOrder, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },

        //二维码管理
        getCodeList: function(opt) {//获取二维码批次表
            var d = $q.defer();
            _httpGet(urlGetCodeList, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        getBatchCode: function(opt) {//批量获取二维码
            var d = $q.defer();
            _httpGet(urlGetBatchCode, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },

        //基本信息
        doQuertionSave: function(opt) {//保存提示回答
            var d = $q.defer();
            _httpGet(urlDoQuertionSave, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        getQuertion: function(opt) {//保存提示回答
            var d = $q.defer();
            _httpGet(urlGetQuertion, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
    };
    
    return service;
})

app
// 服务：一般性公用服务
.factory('CommonService',  function($q, _jsonp, _httpGet, _httpPost,_setting){
    var urlFileDelete = '/common/delete-project-files', // 删除楼盘资源包
        urlUploadImg = '/upload-base64-image', // 图片上传
        service = null;

    service = {
        doFileDelete: function(opt) { // 删除楼盘资源包
            var d = $q.defer();
            _httpGet(urlFileDelete, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        doUploadImg: function(opt) { // 图片上传
            var d = $q.defer();
            _httpPost(urlUploadImg, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        }
    };
    
    return service;
})

app
// 服务：一般性公用服务
    .factory('ApplicationService',  function($q, _jsonp, _httpGet, _httpPost,_setting){
        var urlGetApplicationList = '/admin/app/list', // 获取app列表
            urlAddApplication = '/admin/app/add', // 添加app
            urlGetAppUserList = '/admin/user/list', // 获取app用户列表
            urlGetAPersentList = '/admin/withdraw/list', // 提现处理
            urlChangeUserStatus = '/admin/user/update-status', // 更改用户状态
            urlDoPay = '/admin/deal/pay', // 打款状态操作
            urlGetBackstageList = '/admin/list', // 后台帐户列表
            urlOnline = '/admin/app/update', // 上架app与下架app操作
            urlAddAccount = '/admin/add', // 添加后台管理员账号

            urlUploadImg = '/upload-base64-image', // 图片上传
            service = null;

        service = {
            getApplicationList: function(opt) { // 获取应用列表
                var d = $q.defer();
                _httpGet(urlGetApplicationList, opt)
                    .then(function(data) {
                        d.resolve(data);
                    }, function(data) {
                        d.reject(data);
                    });
                return d.promise;
            },
            addApplication: function(opt) { // 添加应用
                var d = $q.defer();
                _httpPost(urlAddApplication, opt)
                    .then(function(data) {
                        d.resolve(data);
                    }, function(data) {
                        d.reject(data);
                    });
                return d.promise;
            },
            getAppUserList: function(opt) { // 获取APP用户列表
                var d = $q.defer();
                _httpGet(urlGetAppUserList, opt)
                    .then(function(data) {
                        d.resolve(data);
                    }, function(data) {
                        d.reject(data);
                    });
                return d.promise;
            },
            getAPersentList: function(opt) { // 提现处理列表
                var d = $q.defer();
                _httpGet(urlGetAPersentList, opt)
                    .then(function(data) {
                        d.resolve(data);
                    }, function(data) {
                        d.reject(data);
                    });
                return d.promise;
            },
            changeUserStatus: function(opt) { // 更改用户状态
                var d = $q.defer();
                _httpGet(urlChangeUserStatus, opt)
                    .then(function(data) {
                        d.resolve(data);
                    }, function(data) {
                        d.reject(data);
                    });
                return d.promise;
            },
            doPay: function(opt) { // 打款状态操作
            var d = $q.defer();
            _httpGet(urlDoPay, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        getBackstageList: function(opt) { // 打款状态操作
            var d = $q.defer();
            _httpGet(urlGetBackstageList, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        online: function(opt) { // 上架与下架app
            var d = $q.defer();
            _httpPost(urlOnline, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },
        addAccount: function(opt) { // 添加后台管理员账号
            var d = $q.defer();
            _httpPost(urlAddAccount, opt)
                .then(function(data) {
                    d.resolve(data);
                }, function(data) {
                    d.reject(data);
                });
            return d.promise;
        },

        };

        return service;
    })
;