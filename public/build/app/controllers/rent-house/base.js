/**
 * Created by Administrator on 2018/5/28.
 */
app.register.controller('base', function ($scope,$rootScope,rentalHouseService,CommonService,$timeout,_validate) {

    'use strict';
    var id = $rootScope.$stateParams.id;
    $scope.urlId = id;

    $scope.state = {
        questions:'',//问题回答
    };

    var ajaxParams = {
        questions:'',
    }

    // -- 获取小区问答信息
    var getQuertion = function(opt, cb, cberr) {
            rentalHouseService.getQuertion(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        getQuertionHandler = function(data) {
            layer.closeAll();
            console.log(data.__state.msg)
            $scope.state.questions = data.__state.msg;
        };

    layer.load('2')
    getQuertion({},getQuertionHandler)

    // -- 保存
    var doQuertionSave = function(opt, cb, cberr) {
            rentalHouseService.doQuertionSave(opt)
                .then(function(data) {
                    if(typeof cb === 'function')cb(data);
                }, function(data) {
                    if(typeof cberr === 'function')cberr(data);
                });
        },
        doQuertionSaveHandler = function(data) {
            layer.closeAll();
            if(data && data['__state'] && data['__state'].code === 10200) {
                layer.alert(data['__state'].msg, function(idx) {
                    layer.close(idx);
                    //$rootScope.$state.go('rent-house-list',{id:''});
                    window.location.reload();
                });
            }
        };

    $scope.act = {
        doSave: function () {
            layer.load('2')
            ajaxParams.questions = $scope.state.questions;
            console.log($scope.state.questions)
            doQuertionSave(ajaxParams,doQuertionSaveHandler)
        }
    };
});