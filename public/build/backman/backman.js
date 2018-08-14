var backman = angular.module('backman', ['ui.router']);

backman.config(function ($httpProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

    'use strict';

    // 修正angularPost数据payload模式为formData模式
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.get = {'X-Requested-With': 'XMLHttpRequest'};

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                if (obj.hasOwnProperty(name)) {
                    value = obj[name];
                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            if (value.hasOwnProperty(subName)) {
                                subValue = value[subName];
                                /* fullSubName = name + '[' + subName + ']'; //for node */
                                fullSubName = name + '.' + subName;
                                innerObj = {};
                                innerObj[fullSubName] = subValue;
                                query += param(innerObj) + '&';
                            }
                        }
                    } else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];

    //增加angular自动过滤特殊url白名单
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|sms|javascript):/);

});

//路由转接
backman.run(function ($rootScope, $state, $stateParams) {

    'use strict';

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

});

//backman创建模块
backman.module = function (name, dependences) {

    'use strict';

    var app = angular.module(name, ['backman'].concat(dependences));
    app.config(function($controllerProvider, $compileProvider, $filterProvider, $provide){
        //异步controller注册器
        app.register = {
            controller: $controllerProvider.register,
            directive: $compileProvider.directive,
            filter: $filterProvider.register,
            factory: $provide.factory,
            service: $provide.service
        };
    });
    return app;

};




// 服务：地址tree全局缓存服务
backman.factory('_chinaAddress', function ($http, $q, _tools, _setting) {

    'use strict';

    var tree = null;
    var deferred2 = $q.defer();

    localStorage.removeItem('AREA_TREE'); // 清空原來
    localStorage.removeItem('AREA_TREE20170324'); // 清空原來 region_id 和 parent_id 为数字类型
    localStorage.removeItem('AREA_TREE20170323'); // 清空原來 region_id 和 parent_id 为数字类型
    localStorage.removeItem('AREA_TREE201703231930'); // 清空原來修改
    localStorage.removeItem('AREA_TREE20170720'); // 清空原來修改

    var StorageKey = 'AREA_TREE20180719';

    var tempTree = localStorage.getItem(StorageKey);

    tempTree = tempTree?JSON.parse(tempTree) : [];

    if(tempTree && tempTree.length) {
        tree = tempTree;
        deferred2.resolve(tree);
    }else {
        // 当前修改为请求远程文件的方式来获取区域信息
        $http.get('/kojiadmin/build/_data/region.json').then(function (data) {
            if (data.data.state.code == 10200) {
                tree = [];
                var list = _tools.transKeyName('camel', data.data.data);
                //匹配依赖依据：
                //所有地址regionId存在从小到大排列的规律，且parentId必定比自身regionId小，所以parent元素必定先于自身已经被创建
                for (var i = 0; i < list.length; i++) {
                    //省级
                    if (list[i].parentId == '' || list[i].parentId == '0') {
                        list[i].children = [];
                        tree.push(list[i]);
                    } else {
                        //市级
                        for (var j = 0; j < tree.length; j++) {
                            if (tree[j].regionId == list[i].parentId) {
                                list[i].children = [];
                                tree[j].children.push(list[i]);
                                break;
                            } else {
                                //区级
                                for (var k = 0; k < tree[j].children.length; k++) {
                                    if (tree[j].children[k].regionId == list[i].parentId) {
                                        tree[j].children[k].children.push(list[i]);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                tree = [];
            }
            localStorage.setItem(StorageKey, JSON.stringify(tree));
            deferred2.resolve(tree);
        }, function (err) {
            tree = [];
            deferred2.resolve(tree);
        });
    }


    return {
        getTree: function () {
            if (tree) {
                var deferred = $q.defer();
                deferred.resolve(tree);
                return deferred.promise;
            } else {
                return deferred2.promise;
            }
        },
        getProvinces: function(){
            return this.getTree();
        },
        getCities: function(provinceId){
            return this.getProvinces().then(function(data){
                for (var i = 0; i < data.length; i++) {
                    if (data[i].regionId == provinceId) {
                        return data[i].children;
                    }
                }
            });
        },
        getDistricts: function(provinceId, cityId){
            return this.getCities(provinceId).then(function(data){
                for (var i = 0; i < data.length; i++) {
                    if (data[i].regionId == cityId) {
                        return data[i].children;
                    }
                }
            });
        },
        /**
         * 获取对应的区域id的数据
         * @param  {String} type     'provinces','cities','blocks'
         * @param  {String} regionId 区域id
         * @return {Object}          区域id对应的对象
         */
        getRegionIdData: function(arr, regionId){
            var result = '';
            if (arr) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i].regionId == regionId) {
                        result = arr[i].regionName;
                        break;
                    }
                }
            }
            return result;
        }
    };
});

// 服务：请求预处理
backman.factory('_responePreHandler', function (_tools, _setting) {

    'use strict';

    return {
        //正常通行
        success: function (success, config) {
            //需要重新登录
            if (success.data.state.code == 20001) {
                if (config && config.noVerify == true) {
                    return null;
                }
                layer.alert('您的登录已失效，即将跳转登录页...', {
                        icon: 0,
                        title: false,
                        closeBtn: 0
                    }, function () {
                    }
                );
                setTimeout(function () {
                    window.location.href = _setting.get('loginUrl');
                }, 3000);
                return null;
            }
            //正常code：10200
            if (success.data.state.code == 10200) {
                var data = success.data.data ? _tools.transKeyName('camel', success.data.data) : {};
                data.__state = _tools.transKeyName('camel', success.data.state);
                return data;
            }
            //正常code：10205
            else if (success.data.state.code == 10205) {
                return {
                    __state: _tools.transKeyName('camel', success.data.state)
                };
            }
            //报错code
            else {
                //var str = '错误：code ' + success.data.state.code + '<br>' + (success.data.state && success.data.state.msg);
                var str = (success.data.state && success.data.state.msg);
                layer.alert(str, {
                    icon: 2,
                    title: '通讯内容有误！'
                });
                return null;
            }
        },
        //http级报错
        error: function (err) {
            layer.alert('错误：status ' + err.status + ' ' + err.statusText, {
                icon: 2,
                title: '建立通讯失败！'
            });
            return null;
        }
    };

});

backman.factory('_httpPost', function ($http, _tools, _responePreHandler, _setting) {

    'use strict';


    return function (url, postData, config) {
        config = angular.isObject(config)?config:{};
        if (!config || !config.globAjaxParams) {
            angular.extend(postData, _setting.globAjaxParams);
        }
        postData = _tools.transKeyName('underline', postData);
        return $http({
            method: 'POST',
            url: _setting.test(config.isIgnoreTest) + url,
            data: postData
        }).then(function (success) {
                return _responePreHandler.success(success, config);
            }, function (err) {
                return _responePreHandler.error(err);
            }
        );
    };

});

backman.factory('_httpGet', function ($http, _tools, _responePreHandler, _setting) {

    'use strict';

    return function (url, getData, config) {
        config = angular.isObject(config)?config:{};
        if (!config || !config.globAjaxParams) {
            angular.extend(getData, _setting.globAjaxParams);
        }
        getData = _tools.transKeyName('underline', getData);
        return $http({
            method: 'GET',
            url: _setting.test(config.isIgnoreTest) + url,
            params: getData
        }).then(function (success) {
            return _responePreHandler.success(success, config);
        }, function (err) {
            return _responePreHandler.error(err);
        });
    };

});
backman.factory('_jsonp', function ($http, _tools, _setting, _responePreHandler) {
	
    return function (url, getData, config) {
        // getData.system = 'wap';
        getData.callback = 'JSON_CALLBACK';

        getData = _tools.transKeyName('underline', getData);

        return $http({
            method: 'JSONP',
            url: url,
            params: getData
        }).then(function (success) {
            return _responePreHandler.success(success);
        }, function (err) {
            return _responePreHandler.error(err);
        });
    };
});


backman.factory('_setting', function ($rootScope) {

    'use strict';

    var _data = {
        base: location.protocol + '//' + location.host,
        path: '/' + location.pathname.split('/index.html')[0],
        // path: '/' + location.pathname.split(/\/([^\/])*?$/)[0],
        globAjaxParams: {}
    };
    _data.path = _data.path == '/' ? '' : _data.path;

    //左侧导航栏接口地址
    _data.navListUrl = _data.base + '/kojiadmin/build/_data/navList.json';

    //登录页地址
    _data.loginUrl = _data.base + _data.path + '/login.html';

    //退出登录接口地址
    _data.logoutUrl = _data.base + _data.path + '';
    // 退出后重定向地址
    // _data.logoutRedirectUrl = ''; // 不设置的话默认刷新当前页面（在控制器里写）

    //全局图片上传设置
    _data.globUploadImg = {
        //接口地址
        url: '/api/upload-base64-image',
        //base64键名
        fileKeyName: 'base64File',
        //同时发送的其他参数
        parameters: {}
    };

    _data.userInforUrl = '/reseller-admin/user/user-info';

    //富文本编辑器图片上传接口
    _data.kindUploadImgUrl = '/api/upload-image';


    return {
        get: function (key) {
            return _data[key];
        },
        set: function (key, val) {
            if (key == 'globAjaxParams') {
                if ($.type(val) == 'object') {
                    angular.extend(_data.globAjaxParams, val);
                }
            } else if (key == 'globUploadImg') {
                if ($.type(val) == 'object') {
                    angular.extend(_data.globUploadImg, val);
                }
            } else {
                _data[key] = val;
            }
        },
        test: function(isIgnoreTest) {
            var r = '';
            var path = window.location.pathname;
            if(!isIgnoreTest && path.indexOf('/test') >= 0) {
                r = '/test';
            }
            return r;
        },
        fp:(window.location.hostname.indexOf('test') >= 0)?'http://test.fp.ysf.mobi':
        	(window.location.hostname.indexOf('pre') >= 0)?'http://pre.fp.ysf.mobi':'http://fp.ysf.mobi'
    };

});

backman.constant('_tools', (function () {

    'use strict';

    //获取url参数
    var urlData = null;
    var getUrlParam = function (name) {
        if (!urlData) {
            var url = window.location.href;
            urlData = {};
            var arr = url.split("?");
            if (arr.length > 1) {
                arr = arr[1].split("&");
                for (var i = 0, l = arr.length; i < l; i++) {
                    var a = arr[i].split("=");
                    urlData[a[0]] = a[1];
                }
                urlData = transKeyName('camel', urlData);
            }
        }
        return urlData[name];
    };

    //峰驼与下划线命名模式转换
    var transKeyName = function (type, json) {
        //下划线字符串转小峰驼
        var toCamel = function (str) {
            var str2 = '';
            if (str.indexOf('_') < 0) {
                str2 = str;
            } else {
                var words = str.split('_');
                for (var i = 1; i < words.length; i++) {
                    words[i] = words[i].substr(0, 1).toUpperCase() + words[i].substr(1);
                }
                str2 = words.join('');
            }
            return str2;
        };
        //小峰驼字符串转下划线
        var toUnderline = function (str) {
            var str2 = '';
            if ((/[A-Z]/).test(str)) {
                str2 = str.replace(/([A-Z])/g, function ($1) {
                    return '_' + $1.toLowerCase();
                });
            } else {
                str2 = str;
            }
            return str2;
        };
        var transform = function (json, json2) {
            for (var p in json) {
                if (json.hasOwnProperty(p)) {
                    var key;
                    //字符串进行键名转换
                    if (!/^\d+$/.test(p)) {
                        if (type == 'camel') {
                            key = toCamel(p);
                        } else if (type == 'underline') {
                            key = toUnderline(p);
                        }
                    }
                    //数值直接传递
                    else {
                        key = parseInt(p);
                    }
                    //属性为对象时，递归转换
                    if (json[p] instanceof Object) {
                        json2[key] = transform(json[p], $.type(json[p]) == 'array' ? [] : {});
                    }
                    //属性非对象，为字符串但内容符合json格式，递归转换
                    else if ($.type(json[p]) == 'string' && /^[\{\[]+("([a-zA-Z][a-zA-Z0-9\-_]*?)"\:(.+?))+[\}\]]+$/.test(json[p])) {
                        json2[key] = JSON.parse(json[p]);
                        json2[key] = transform(json2[key], $.type(json2[key]) == 'array' ? [] : {});
                        json2[key] = JSON.stringify(json2[key]);
                    }
                    //属性非对象，非json字符串，直接传递
                    else {
                        json2[key] = json[p];
                    }
                }
            }
            return json2;
        };
        return transform(json, $.type(json) == 'array' ? [] : {});
    };

    var loadJs = function (jsList) {
        return function ($q, $rootScope) {
            var deferred = $q.defer();
            $script(jsList, function () {
                $rootScope.$apply(function () {
                    deferred.resolve();
                });
            });
            return deferred.promise;
        };
    };

    return {
        getUrlParam: getUrlParam,
        transKeyName: transKeyName,
        loadJs: loadJs
    };

})());
backman.factory('_validate', function () {

    'use strict';

    return {
        isMobile: function (val) {
            var rgx = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i;
            return rgx.test($.trim(val));
        },
        isRequired: function (val) {
            return $.trim(val) ? true : false;
        },
        isMatchLength: function (val, len) {
            return (($.trim(val)).length == len);
        },
        isLengthInRange: function (val, arr) {
            var len = ($.trim(val)).length;
            return (len >= arr[0] && len <= arr[1]);
        },
        isInRange: function (val, arr) {
            return (val >= arr[0] && val <= arr[1]);
        },
        isIdCard: function (val) {
            var rgx = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
            return rgx.test($.trim(val));
        },
        isTheSame: function (val1, val2) {
            return (val1 == val2);
        },
        // 验证密码
        isCorrectPassword: function (val) {
            // 只包含数字或字母
            var rgx = /^(?!\d+$)(?![a-z]+$).+$/i;
            return rgx.test($.trim(val));
        }
    };
});
backman.controller('backmanFramework', function ($scope, _setting, _httpGet) {

    'use strict';

    //移动端导航栏显示隐藏
    $scope.sidebarOpen = false;
    

    // _httpGet(_setting.get('userInforUrl'),{});

});
backman.controller('backmanSidebar', function ($scope, _setting, _httpGet) {

    'use strict';

    //移动端导航栏显示隐藏
    $scope.act = {
        //导航栏移动端显示隐藏
        toggleSidebar: function () {
            $scope.$parent.$parent.sidebarOpen = !$scope.$parent.$parent.sidebarOpen;
            // $scope.$parent.$parent.toggleSidebar();
        }
    };

    // _httpGet(_setting.get('userInforUrl'),{});

});
backman.controller('backmanNavigation', function ($scope, _setting, _httpGet) {

    'use strict';

    var getNavData = function (cb, cberr) {
            var apiAddress = _setting.get('navListUrl');
            _httpGet(apiAddress, {},{isIgnoreTest:true})
                .then(function (data) {
                    if ($.type(cb) === 'function') {
                        var navList = [];
                        for (var i = 0, item1; item1 = data[i]; i++) {
                            //第一级不允许使用连接
                            if (item1.state || item1.hash) {
                                continue;
                            }
                            //检查children属性
                            if ($.type(item1.children) != 'array') {
                                item1.children = [];
                            } else {
                                for (var j = 0, item2; item2 = item1[j]; j++) {
                                    if ($.type(item2.children) != 'array') {
                                        item2.children = [];
                                    }
                                }
                            }
                            navList.push(item1);
                        }
                        cb(navList);
                    }
                }, function (data) {
                    if ($.type(cberr) === 'function') {
                        cberr(data);
                    }
                });
        },
        renderNavigation = function (data) {
            //第一层排序
            data = data.sort(sortNavigation);
            for (var i = 0, item; item = data[i]; i++) {
                if (item.children && item.children.length) {
                    //第二层排序
                    item.children.sort(sortNavigation);
                }
            }
            $scope.navData = data;
        },
        sortNavigation = function (item1, item2) {
            return item1.order > item2.order;
        };
    getNavData(renderNavigation);

});
backman.controller('backmanLogout', function ($scope, _setting, _httpGet, _httpPost) {

    'use strict';

    var loginUrl = _setting.get('loginUrl'),
        logoutUrl = _setting.get('logoutUrl');
    loginUrl = loginUrl?loginUrl:'';

    var doLogout = function(cb, cberr) {
        if(logoutUrl) {
            _httpGet(logoutUrl, {})
                .then(function(data) {
                    if(typeof cb === 'function') cb(data);
                }, function(data) {
                    if(typeof cberr === 'function') cberr(data);
                });
        }
    },
    doLogoutHandler = function(data) {
        if(data && data['__state'] && data['__state'].code === 10200) {
            if(loginUrl) {
                window.location.href = _setting.test() + loginUrl;
            } else {
                window.location.reload();
            }
        }
    };

    $scope.act = {
        doLogout: function() {
            doLogout(doLogoutHandler);
        }
    };

});

backman.directive('bmDatepick', function () {

    'use strict';

    return {
        scope: {
            bindDate: '='
        },
        restrict: 'A',
        link: function ($scope, iElm, iAttrs) {
            var format = iAttrs.dateFormate || 'YYYY-MM-DD hh:mm:ss'; //日期格式
            var timePick = /(hh|mm|ss)+/g.test(format); //是否开启时间选择
            var eid = iAttrs.id || 'datepick' + (Date.now() % 1e7) + parseInt(Math.random() * 1e3);
            iElm.attr('id', eid)
                .attr('placeholder', format)
                .addClass('laydate-icon')
                .on('click', function () {
                    var $this = $(this);
                    if (!$this.attr('readonly')) {
                        $this[0].dispatchEvent(new MouseEvent('dblclick', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        }))
                    }
                });
            $('#' + eid).one('dblclick', function () {
                var $this = $(this);
                setTimeout(function(){
                    $('#laydate_clear').on('click', function () {
                        $scope.bindDate = '';
                        if (!$scope.$$phase && !$scope.$root.$$phase) {
                            $scope.$apply();
                        }
                    });
                    $('#laydate_today').on('click', function () {
                        $scope.bindDate = $this.val();
                        if (!$scope.$$phase && !$scope.$root.$$phase) {
                            $scope.$apply();
                        }
                    });
                }, 0);
            });
            laydate({
                elem: '#' + eid,
                format: format,
                istime: timePick,
                event: 'dblclick',
                choose: function (dates) {
                    $scope.bindDate = dates;
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                }
            });
            //初次数据
            var initW = $scope.$watch('bindDate', function (newVal, oldVal) {
                if (newVal) {
                    initW();
                    iElm.val(newVal);
                }
            });
        }
    }
});
// 指令: 处理多级联动下拉菜单
// disabled-select="1" 设置该属性将不能设置区域
backman.directive('bmDistpicker', function() {

    'use strict';

    return {
        restrict: 'A',
        scope: {
            region: '=region', // 与控制器的$scope.region绑定
            selectedPlace: '=selectedplace' // 与控制器的$scope.selectedPlace (双向)绑定
        },
        replace: true,
        transclude: false,
        template: '<div class="distpicker">' +
                        '<div class="distpicker-content" >' +
                            '<select class="" ng-options="province.regionId as province.regionName for province in region.provinces" ng-model="selectedPlace.provinceCode">' +
                                '<option value="" >请选择省份</option>' +
                            '</select>' +
                            '<select class="" ng-options="city.regionId as city.regionName for city in region.cities" ng-model="selectedPlace.cityCode">' +
                                '<option value="" >请选择市</option>' +
                            '</select>' +
                            '<select class="" ng-options="block.regionId as block.regionName for block in region.blocks" ng-model="selectedPlace.blockCode">' +
                                '<option value="" >请选择区/县</option>' +
                            '</select>' +
                        '</div>' +
                   '</div>',
        link: function(scope, iElement, iAttrs) {
            if (parseInt(iAttrs.disabledSelect, 10) == 1) {
                iElement.find('.distpicker-content>select').attr('disabled', 'disabled');
            }
        },
        controller: function($scope, _chinaAddress) {
            // 获取一次菜单
            _chinaAddress.getTree().then(function(data) {
                $scope.region.provinces = data;
            });

            // 省的变化
            $scope.$watch('selectedPlace.provinceCode', function(newVal, oldVal, scope) {

                // 如果值改变
                if (!!newVal) {

                    // 设置显示的值 城市与区域
                    _chinaAddress.getCities($scope.selectedPlace.provinceCode).then(function(data) {
                        $scope.region.cities = data;
                        $scope.region.blocks = [];
                    });

                    $scope.selectedPlace = {
                        provinceCode: newVal, //省编号
                        cityCode: '', //市编号
                        blockCode: '', //区/县编号
                        provinceName: _chinaAddress.getRegionIdData($scope.region.provinces,newVal), //省名
                        cityName: '', //市名
                        blockName: '', //区/县名
                    };

                }else{
                    $scope.region.cities = [];
                    $scope.region.blocks = [];
                }
            });

            // 市的变化
            $scope.$watch('selectedPlace.cityCode', function(newVal, oldVal, scope) {

                // 如果值改变
                if (!!newVal) {

                    // 设置显示的值 区域
                    _chinaAddress.getDistricts(
                        $scope.selectedPlace.provinceCode,
                        $scope.selectedPlace.cityCode
                    ).then(function(data) {
                        $scope.selectedPlace.cityCode = newVal;
                        $scope.region.blocks = data;
                    });
                    // $scope.selectedPlace.blockCode = '';
                    scope.selectedPlace = {
                        provinceCode: $scope.selectedPlace.provinceCode, //省编号
                        cityCode: newVal, //市编号
                        blockCode: '', //区/县编号
                        provinceName: $scope.selectedPlace.provinceName, //省名
                        cityName:  _chinaAddress.getRegionIdData($scope.region.cities,newVal), //市名
                        blockName: '', //区/县名
                    };
                }else{
                    $scope.region.blocks = [];
                }
            });

            // 区的变化
            $scope.$watch('selectedPlace.blockCode', function(newVal, oldVal, scope) {
                if (newVal !== oldVal) {
                    $scope.selectedPlace.blockCode = newVal;
                    $scope.selectedPlace = {
                        provinceCode: $scope.selectedPlace.provinceCode, //省编号
                        cityCode: $scope.selectedPlace.cityCode, //市编号
                        blockCode: newVal, //区/县编号
                        provinceName: $scope.selectedPlace.provinceName, //省名
                        cityName:  $scope.selectedPlace.cityName, //市名
                        blockName: _chinaAddress.getRegionIdData($scope.region.blocks,newVal), //区/县名
                    };
                }
            });

        }

    };
});

backman.directive('bmEditor', function (_setting) {

    'use strict';

    return {
        scope: {
            bindContent: '='
        },
        restrict: 'A',
        link: function ($scope, iElm, iAttrs) {
            var eid = iAttrs.id || 'editor' + (Date.now() % 1e7) + parseInt(Math.random() * 1e3);
            iElm.attr('id', eid);
            var editor = KindEditor.create('#' + eid, {
                items: [
                    'source', '|',
                    'undo', 'redo', '|',
                    'template', 'code', '|',
                    'cut', 'copy', 'paste', 'plainpaste', 'wordpaste', '|',
                    'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist',
                    'insertunorderedlist', 'indent', 'outdent', 'subscript', 'superscript', 'clearhtml',
                    'quickformat', '|', 'selectall', 'fullscreen', '/',
                    'formatblock', 'fontname', 'fontsize', '|',
                    'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'lineheight',
                    'removeformat', '|',
                    'image', 'multiimage', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak', 'anchor', 'link', 'unlink', '|',
                    'preview', 'print', 'about'
                ],
                width: '100%',
                height: '270px',
                resizeMode: 1,
                allowFileManager: false,
                //imageUploadJson: _setting.get('kindUploadImgUrl') || '',
                uploadJson: _setting.get('kindUploadImgUrl') || '',
                afterChange: function () {
                    if (editor) {
                        $scope.bindContent = editor.html();
                        if (!$scope.$$phase && !$scope.$root.$$phase) {
                            $scope.$apply();
                        }
                    }
                }
            });
            //初次数据
            var initW = $scope.$watch('bindContent', function (newVal, oldVal) {
                if (newVal) {
                    initW();
                    editor.html(newVal + '');
                }
            });
        }
    }
});
backman.directive('bmSidebar', function () {
    return {
        scope: false,
        restrict: 'A',
        link: function ($scope, iElm, iAttrs) {
            iElm.on('click', '.treeview-title', function () {
                var $this = $(this);
                if ($this.parent().hasClass('active')) {
                    $this.parent().removeClass('active').end()
                        .next('ul.treeview-menu').slideUp('fast');
                } else {
                    $this.parent().addClass('active').end()
                        .next('ul.treeview-menu').slideDown('fast');
                }
            });
            var navInitHandler = $scope.$watch('navData', function (newValue, oldValue) {
                if (newValue) {
                    navInitHandler();  //仅运行一次
                    var hash = window.location.hash;
                    setTimeout(function () {
                        iElm.find('.treeview-link').each(function () {
                            var $this = $(this);
                            if ($this.attr('href') == hash) {
                                var $parent1 = $this.parent().parent().show().parent().addClass('active');
                                if ($parent1.hasClass('treeview')) {
                                    var $parent2 = $parent1.parent().show().parent().addClass('active');
                                    if ($parent2.hasClass('treeview')) {
                                        $parent2.addClass('active');
                                    }
                                }
                            }
                        });
                    }, 0);
                }
            });
        }
    }
});
/*
 * author:tank
 * date:2016-12-12
 * desc:component select2
 */
backman.directive('bmSelect2', function($timeout){
    'use strict';

    return {
        scope: {
            bindList:'=', // 列表中的数据集
            bindSearch:'@', // 搜索哪个字段
            bindData:'=' // 统一返回数组
        },
        restrict: 'A',
        template: '<div class="bm-select2-box" ng-click="$event.stopPropagation();">' +
                        '<input type="text" class="bm-select2-input" ng-model="name">' +
                        '<ul class="bm-select2-list list-unstyled">' +
                            '<li ng-if="isShowCheckbox">' +
                                '<label style="margin: 0;">'+
                                    '<input type="checkbox" ng-checked="checkedAll" ng-click="act.doCheckAll(filtoutData);"/>' +
                                    '<span>全选</span>' +
                                '</label>' +
                            '</li>' +
                            '<li ng-repeat="item in filtoutData">' +
                                '<label style="margin: 0;" ng-if="!isShowCheckbox" ng-click="act.doClick(item);" ng-bind="item[bindSearch]"></label>' +
                                '<label style="margin: 0;" ng-if="isShowCheckbox">'+
                                    '<input type="checkbox" ng-checked="item.checked" ng-click="act.doClick(item);"/>' +
                                    '<span ng-bind="item[bindSearch]"></span>' +
                                '</label>' +
                            '</li>' +
                        '</ul> ' +
                    '</div>',
        replace: true,
        link: function($scope, iElm, iAttrs, ctrl) {
            var doc = $(document),
                input = iElm.children('input'),
                ul = iElm.children('ul');

            // 控件行为
            input.click(function(e) {
                var hideUl = function() {
                    ul.hide();
                    doc.off('click', hideUl);
                };
                var isUlShow = ul.css('display') != 'none';
                if(isUlShow) {
                    ul.hide();
                    doc.off('click', hideUl);
                }else {
                    ul.show();
                    doc.on('click', hideUl);
                }
            });

            // 筛选用函数
            var filterFn = function(key, data) {
                var searchin = $scope.bindSearch;
                var result = [];
                if(key && data && data.length) {
                    angular.forEach(data, function(v, k, obj) {
                        if(v[searchin].indexOf(key) >= 0) {
                            result.push(v);
                        }
                    });
                }
                return result;
            };

            // 模板中用到的模型
            $scope.bindListCopy = []; // 拷贝出来的数据源
            $scope.filtoutData = []; // 过滤出来的数据(展示用)
            $scope.name = ''; // input输入框的模型
            $scope.isShowCheckbox = parseInt(iAttrs.isShowCheckbox, 10) === 1 ? true : false  ; // 是否显示复选框
            $scope.checkedAll = false; // 是否全选
            $scope.bindData = []; // 返回控制器的结果集

            // arr就是结果集合$scope.bindData
            var toggleSelectedItem = function(arr, it) {
                var idx = arr.indexOf(it);
                if(it.checked) {
                    if(idx < 0) {
                        arr.push(it);
                    }
                } else {
                    if(idx >= 0) {
                        arr.splice(idx, 1);
                    }
                }
                return arr;
            };

            $scope.act = {
                doClick:function(item) {
                    if($scope.isShowCheckbox) { // 多选的情况
                        item.checked = !item.checked;
                        $scope.bindData = toggleSelectedItem($scope.bindData, item);
                    } else { // 单选的情况
                        $scope.name = item[$scope.bindSearch];
                        $scope.bindData = [item];

                        // 写这里貌似不太好
                        ul.hide();
                    }
                },
                doCheckAll:function(allItems) {
                    if($scope.isShowCheckbox) { // 多选的情况
                        $scope.checkedAll = !$scope.checkedAll;
                        angular.forEach(allItems, function(v, k) {
                            v.checked = $scope.checkedAll;
                            toggleSelectedItem($scope.bindData, v);
                        });
                    }
                }
            };

            // 如果绑定的数据源改变了，则重新初始化一些值
            $scope.$watch('bindList', function(newVal, oldVal) {
                var dataPreHandler = function(dt) {
                    if(dt && dt.length) {
                        angular.forEach(dt, function(v, k) {
                            v.checked = false;
                        });
                    }
                    return dt;
                };
                if(newVal) {
                    $scope.bindListCopy = dataPreHandler(angular.copy($scope.bindList));
                    $scope.filtoutData = [].concat($scope.bindListCopy);
                    $scope.name = '';
                    $scope.bindData = [];
                    if ($scope.isShowCheckbox) {
                        $scope.checkedAll = false;
                    }
                }
            });

            // 函数节流，减少筛选的次数
            var timeObj = null;
            $scope.$watch('name', function(newVal, oldVal) {
                if(timeObj){
                    $timeout.cancel(timeObj);
                }
                timeObj = $timeout(function(){
                    var search = $.trim(newVal)?$.trim(newVal):'';
                    if(search) {
                        $scope.filtoutData = filterFn(search ,$scope.bindListCopy);
                    }else {
                        $scope.filtoutData = [].concat($scope.bindListCopy);
                    }
                    $scope.checkedAll = false;

                    timeObj = null;
                }, 500);
            });
        }
    };
});
backman.directive('bmUploadImg', function (_setting, _httpPost) {

    'use strict';

    return {
        scope: {
            bindId: '=',
            bindUrl: '='
        },
        restrict: 'A',
        template: '<div class="bm-upload-img-bg img-thumbnail">' +
        '  <i class="fa fa-image"></i><i class="fa fa-plus"></i></div>' +
        '<div class="bm-upload-img-input"><input type="file" /></div>' +
        '<div class="bm-upload-img-uping" ng-if="state.upAjaxing" title="上传中，请稍后...">' +
        '  <i class="fa fa-spinner"></i></div>' +
        '<div class="bm-upload-img-view img-thumbnail" ng-if="bindUrl" tabindex="-1">' +
        '  <span><img ng-src="{{bindUrl}}" data-img-id="{{bindId}}"/></span>' +
        '  <i class="fa fa-times" ng-click="act.delImg()"></i>' +
        '</div>',
        link: function ($scope, iElm, iAttrs) {
            var eid = iAttrs.id || 'uploadImg' + (Date.now() % 1e7) + parseInt(Math.random() * 1e3);
            iElm.addClass('bm-upload-img').attr('id', eid);
            $scope.state = {
                upAjaxing: false  //显示上传中状态
            };
            //交互
            $scope.act = {
                delImg: function () {
                    layer.confirm('<img class="bm-upload-img-del" src="' + $scope.bindUrl + '"/>',
                        {title: '确认删除此图片？'}, function (index) {
                            layer.close(index);
                            $scope.bindId = $scope.bindUrl = '';
                            if (!$scope.$$phase && !$scope.$root.$$phase) {
                                $scope.$apply();
                            }
                        }
                    );
                }
            };
            //上传图片
            var upload = function (img) {
                var opt = _setting.get('globUploadImg');
                var sendDate = opt.parameters;
                sendDate[opt.fileKeyName] = img.src;
                _httpPost(opt.url, sendDate)
                    .then(function (data) {
                        $scope.state.upAjaxing = false;
                        if (data) {
                            $scope.bindUrl = data.url;
                            $scope.bindId = data.imgId;
                        }
                    });
            };
            //操作
            iElm
                .find('input').on('change', function () {
                    var files = this.files;
                    if (!files[0]) {
                        $scope.state.upAjaxing = false;
                        return;
                    }
                    //状态检测
                    if (!_setting.get('globUploadImg').url) {
                        layer.alert('未检测到上传接口地址！<br>请配置 “全局上传接口” ');
                        return;
                    }
                    if (iAttrs.imgSize) {
                        if (!/^\d{1,4}[,-_\|xX×]\d{1,4}$/.test(iAttrs.imgSize)) {
                            layer.alert('图片尺寸限制配置不合法！<br>格式例如：300-200');
                            return;
                        }
                    }
                    //显示加载中图标
                    $scope.state.upAjaxing = true;
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                    //读取文件
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = new Image();
                        img.onload = function () {
                            img.onload = null;
                            if (iAttrs.imgSize) {
                                var matchs = iAttrs.imgSize.match(/^(\d{1,4})[,-_\|xX×](\d{1,4})$/);
                                if (img.width != matchs[1] || img.height != matchs[2]) {
                                    var msg = '您选择的图片尺寸为 ' + img.width + ' × ' + img.height +
                                        '，与此处上传要求的尺寸 <b class="text-danger">' +
                                        matchs[1] + ' × ' + matchs[2] + '</b> 不匹配！' +
                                        '是否仍然要坚持继续上传？';
                                    layer.confirm(msg, {icon: 0, title: '尺寸不匹配!'}, function (index) {
                                        layer.close(index);
                                        upload(img);
                                    }, function(){
                                        $scope.state.upAjaxing = false;
                                        if (!$scope.$$phase && !$scope.$root.$$phase) {
                                            $scope.$apply();
                                        }
                                    });
                                } else {
                                    upload(img);
                                }
                            } else {
                                upload(img);
                            }
                        };
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(files[0]);
                })
                .end()
                //点击图片放大显示
                .on('click', 'img', function () {
                    var $this = $(this);
                    var $win = $(window);
                    var widthW = parseInt($win.width() * 0.8);
                    widthW = (widthW % 2 == 0) ? widthW : widthW + 1;
                    var heightW = parseInt($win.height() * 0.8);
                    heightW = (heightW % 2 == 0) ? heightW : heightW + 1;
                    var width = this.naturalWidth;
                    var height = this.naturalHeight;
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
                    }
                    //打开弹窗
                    layer.open({
                        type: 1,
                        shade: 0.3,
                        shadeClose: true,
                        title: false,
                        closeBtn: 2,
                        move: '.layui-layer-content',
                        skin: 'bm-upload-img-super',
                        content: '<span>' + $this[0].src + '</span><img id="rotateImg" src="' + $this.attr('src') + '"/>',
                        area: [size[0] + 'px', size[1] + 'px'],
                        end: function() {
                            $this.parent().parent().focus();
                        },
                        success: function(layero){
                        	var i = 0;
                        	$('#rotateImg').on('mousedown', function(){
                        		i += 90;
                            	$('#rotateImg').css('transform','rotate(' + i + 'deg) translate(-50%,-50%)');
	                            $('#rotateImg').css('transform-origin','0% 0%');
                        	})
				        }
                    });
                    
                });
        }
    }
});
backman.directive('form', function () {

    'use strict';

    return {
        scope: false,
        restrict: 'E',
        priority: 10,
        link: function ($scope, iElm, iAttrs) {
            var fName = '';
            if (iElm.attr('id')) {
                fName = iElm.attr('id');
            } else {
                fName = 'form' + (Date.now() % 1e7) + parseInt(Math.random() * 1e3);
                iElm.attr('id', fName);
            }
            if (!$scope.$forms) {
                $scope.$forms = {};
            }
            $scope.$forms[fName] = {};
        }
    }
});

backman.directive('bmVerify', function () {

    'use strict';

    return {
        scope: {
            bindVerify: '='
        },
        restrict: 'A',
        link: function ($scope, iElm, iAttrs) {
            if (!iAttrs.bindVerify) {
                return;
            }
            if (!iAttrs.verifyItem || iAttrs.verifyItem == '{}') {
                return;
            }
            var validations = null;
            if (iAttrs.verifyItem == 'require') {
                validations = {
                    require: true
                };
            } else {
                validations = JSON.parse(iAttrs.verifyItem.replace(/'/g, '"'));
            }
            var messages = JSON.parse(iAttrs.verifyMsg ? iAttrs.verifyMsg.replace(/'/g, '"') : '{}');
            //当前指令脏值
            var _dirtyState = false;
            //所属表单
            var $curForm = iElm.closest('form');
            var fName = ($curForm.length > 0) ? $curForm.attr('id') : '';
            //变化
            $scope.$watch('bindVerify', function (newVal, oldVal) {
                //脏检查
                if (!_dirtyState && newVal) {
                    _dirtyState = true;
                }
            });
        }
    }

});

backman.directive('bmVerifyControl', function ($timeout) {

    'use strict';

    return {
        scope: false,
        restrict: 'A',
        link: function ($scope, iElm, iAttrs) {
            //等待其他指令完成
            $timeout(function () {
                var fName = '';
                if (iAttrs.bmVerifyControl != '') {
                    fName = iAttrs.bmVerifyControl;
                } else {
                    fName = iElm.closest('form').attr('id');
                }
                $scope.$watch('$forms.' + fName, function (newVal, oldVal) {
                    // console.log(newVal);
                });
            }, 10);
        }
    };

});
