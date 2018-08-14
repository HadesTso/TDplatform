var app = backman.module('app', ['app.router']);


app.config(function () {

    'use strict';

    //your config here
});

//应用配置
app.run(function ($rootScope, _setting) {

    'use strict';
    var user = localStorage.getItem("kojiadmin-user") ? JSON.parse(localStorage.getItem("kojiadmin-user")) : null;

    //右上角管理员名称
    $rootScope.adminName = user.data.mobile || 'anonymous';
    //$rootScope.adminName = window.localStorage['adminName@' + window.location.href.split('#')[0]] || 'anonymous';

    //修改左侧导航栏接口地址
    _setting.set('navListUrl', '/acjladmin/build/_data/navList.json');

    //修改退出按钮接口地址
    _setting.set('logoutUrl', '/acjl-admin/auth/logout');

    //修改登录页地址
    _setting.set('loginUrl', '/acjl-admin/login');

    //设置全局图片上传相关配置
    _setting.set('globUploadImg', {
        //接口地址
        url: '/upload-base64-image',
        //base64键名
        fileKeyName: 'base64File',
        //同时发送的其他参数
        parameters: {
            appid: 4,
            useType: 'project'
        }
    });

    //设置富文本编辑器上传图片地址
    _setting.set('kindUploadImgUrl', '/upload-common-image');

});
