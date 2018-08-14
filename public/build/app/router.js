//路由配置模块
angular
    .module('app.router', [])
    .config(function ($stateProvider, $urlRouterProvider, _tools) {

        'use strict';

        $urlRouterProvider.otherwise('/home');

        //var a = _tools.transKeyName('camel',{key_name:1}); console.log(a);
        var base = '/acjladmin/build';


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
