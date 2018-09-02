//路由配置模块
angular
    .module('app.router', [])
    .config(function ($stateProvider, $urlRouterProvider, _tools) {

        'use strict';

        $urlRouterProvider.otherwise('/home');

        //var a = _tools.transKeyName('camel',{key_name:1}); console.log(a);
        var base = '/build';


        $stateProvider
            // --长租房管理--
            // 房源列表
            .state('rent-house-list', {
                url: '/rent-house-list/:id',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/rent-house/rent-house-list.html',
                        controller: 'rent-house-list'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        base + '/app/controllers/rent-house/rent-house-list.js'
                    ])
                }
            })
            // 添加房源
            .state('rent-house-info', {
                url: '/rent-house-info/:id',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/rent-house/rent-house-info.html',
                        controller: 'rent-house-info'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        base + '/app/controllers/rent-house/rent-house-info.js'
                    ])
                }
            })
            // 租客列表
            .state('rent-user-list', {
                url: '/rent-user-list/:id',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/rent-house/rent-user-list.html',
                        controller: 'rent-user-list'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        base + '/app/controllers/rent-house/rent-user-list.js'
                    ])
                }
            })
            // 看房列表
            .state('look-house-list', {
                url: '/look-house-list/:id',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/rent-house/look-house-list.html',
                        controller: 'look-house-list'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        base + '/app/controllers/rent-house/look-house-list.js'
                    ])
                }
            })

            // --存房订单--
            // 存房订单列表
            .state('save-house-order-list', {
                url: '/save-house-order-list',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/rent-house/save-house-order-list.html',
                        controller: 'save-house-order-list'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        base + '/app/controllers/rent-house/save-house-order-list.js'
                    ])
                }
            })
            //存房订单详情
            .state('save-house-order-detail', {
                url: '/save-house-order-detail/:id',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/rent-house/save-house-order-detail.html',
                        controller: 'save-house-order-detail'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        base + '/app/controllers/rent-house/save-house-order-detail.js'
                    ])
                }
            })

            // --小区管理--
            //小区管理列表
            .state('area-management', {
                url: '/area-management',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/rent-house/area-management.html',
                        controller: 'area-management'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        base + '/app/controllers/rent-house/area-management.js'
                    ])
                }
            })

            // --小区管理--
            //开锁二维码管理
            .state('code-management', {
                url: '/code-management',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/rent-house/code-management.html',
                        controller: 'code-management'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        base + '/app/controllers/rent-house/code-management.js'
                    ])
                }
            })
            //基本信息
            .state('base', {
                url: '/base',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/rent-house/base.html',
                        controller: 'base'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        base + '/app/controllers/rent-house/base.js'
                    ])
                }
            })


            //ios应用列表
            .state('application-list', {
                url: '/application-list',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/application/application-list.html',
                        controller: 'application-list'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        base + '/app/controllers/application/application-list.js'
                    ])
                }
            })
            //android应用列表
            .state('android-application-list', {
                url: '/android-application-list',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/application/android-application-list.html',
                        controller: 'android-application-list'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        base + '/app/controllers/application/android-application-list.js'
                    ])
                }
            })
            //用户管理
            .state('user-management', {
                url: '/user-management',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/application/user-management.html',
                        controller: 'user-management'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        base + '/app/controllers/application/user-management.js'
                    ])
                }
            })
            //数据统计
            .state('data-statistics', {
                url: '/data-statistics',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/application/data-statistics.html',
                        controller: 'data-statistics'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        base + '/app/controllers/application/data-statistics.js'
                    ])
                }
            })
            //提现已处理
            .state('persent-processing-yes', {
                url: '/persent-processing-yes',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/application/persent-processing-yes.html',
                        controller: 'persent-processing-yes'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        base + '/app/controllers/application/persent-processing-yes.js'
                    ])
                }
            })
            //提现未处理
            .state('persent-processing-no', {
                url: '/persent-processing-no',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/application/persent-processing-no.html',
                        controller: 'persent-processing-no'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        base + '/app/controllers/application/persent-processing-no.js'
                    ])
                }
            })
            //后台账号配置列表
            .state('backstage-account-list', {
                url: '/backstage-account-list',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/application/backstage-account-list.html',
                        controller: 'backstage-account-list'
                    }
                },
                resolve:{
                    'load': _tools.loadJs([
                        base + '/app/controllers/application/backstage-account-list.js'
                    ])
                }
            })

            /**
             * 下面的路由是测试用路由可以删除，删除需同时删除左侧目录了的相关条目
             */
            //首页
            .state('home', {
                url: '/home',
                views: {
                    'content': {
                        templateUrl: base + '/app/views/home.html'
                    }
                }
            })
        ;
    });
