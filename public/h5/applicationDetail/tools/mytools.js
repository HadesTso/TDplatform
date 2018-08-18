/**
 * auth: Tank
 * date: 2017-8-30
 * desc: tools for installing plugin
 */

(function(win, undefined){
    var state = {
            // 是否可以用Object.defineProperty
            isDefinePropertyInObject: Object.defineProperty ? true : false
        },
        isArray = function(obj) {
            return Object.prototype.toString.call(obj) == '[object Array]';
        },
        extend = function(obj1, obj2) {
            if(Object.protytype.toString.call(obj1) == '[object Object]' && arguments.length > 1) {
                for(var i = 0, argTemp; i < arguments.length; i++) {
                    argTemp = arguments[i];
                    if(Object.protytype.toString.call(argTemp) == '[object Object]') {
                        for(var key in argTemp) {
                            if(argTemp.hasOwnProperty(key)) {
                                obj1[key] = argTemp[key];
                            }
                        }
                    }
                }

            }
            return obj1;
        },
        trim = function(val) {
            return (''+val).replace(/(^\s*)|(\s*$)/g, "");
        };
    var _setting = {
            base: window.location.host.indexOf('test.sale.ysf.mobi') >= 0 ? 'http://test.sale.ysf.mobi' :
              window.location.host.indexOf('pre.sale.ysf.mobi') >= 0 ? 'http://pre.sale.ysf.mobi' : 
              (window.location.host.indexOf('127.0.0.1') >= 0 || window.location.host.indexOf('localhost') >= 0) ? '':   
              'http://sale.ysf.mobi',
            fp: window.location.host.indexOf('test.sale.ysf.mobi') >= 0 ? 'http://test.fp.ysf.mobi/test' :
              window.location.host.indexOf('pre.sale.ysf.mobi') >= 0 ? 'http://pre.fp.ysf.mobi' : 
              (window.location.host.indexOf('127.0.0.1') >= 0 || window.location.host.indexOf('localhost') >= 0)  ? '':
              'http://fp.ysf.mobi'
        };
    var _tools = (function(){
            var transKeyName = function (type, json) {
                // 下划线字符串转小峰驼
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
                                json2[key] = transform(json[p], isArray(json[p]) ? [] : {});
                            }
                            //属性非对象，为字符串但内容符合json格式，递归转换
                            else if ((typeof json[p] == 'string') && /^[\{\[]+("([a-zA-Z][a-zA-Z0-9\-_]*?)"\:(.+?))+[\}\]]+$/.test(json[p])) {
                                json2[key] = JSON.parse(json[p]);
                                json2[key] = transform(json2[key], isArray(json2[key]) ? [] : {});
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
                return transform(json, isArray(json) ? [] : {});
            };

            var urlParams = null;
            var getUrlParams = function (forceGetAgain) {
                if (!urlParams || forceGetAgain) {
                    var url = decodeURIComponent(location.search);
                    urlParams = {};
                    var arr = url.split("?");
                    if (arr.length > 1) {
                        if(arr[1].indexOf(location.hash) >= 0) {
                            arr[1] = arr[1].split('#')[0];
                        }
                        arr = arr[1].split("&");
                        for (var i = 0, l = arr.length; i < l; i++) {
                            var a = arr[i].split("=");
                            urlParams[a[0]] = a[1];
                        }
                        urlParams = transKeyName('camel', urlParams);
                    }
                }
                return urlParams;
            };

            return {
                transKeyName: transKeyName,
                getUrlParams: getUrlParams
            };
        })();
    var _validate = (function(){
            var vd = {
                isMobile:function(val){
                    var rgx = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|199)\d{8}$/i;
                    return rgx.test(trim(val));
                },
                //匿名电话正则
                isAnonymousMobile:function(val){
                    var rgx = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|199)(\*{4}|\x{4}|\X{4})\d{4}$/i;
                    return rgx.test(trim(val));
                },
                isRequired:function(val){
                        return trim(val)?true : false;
                },
                isMatchLength:function(val,len){
                    return ((trim(val)).length == len);
                },
                isLengthInRange:function(val,arr){
                    var len = (trim(val)).length;
                    return (len >= arr[0] && len <= arr[1]);
                },
                isInRange:function(val,arr){
                    return (val>= arr[0] && val<=arr[1]);
                },
                isIdCard:function(val){
                    var rgx = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
                    return rgx.test(trim(val));
                },
                isTheSame:function(val1,val2){
                    return (val1==val2);
                },
                // 验证密码
                isCorrectPassword:function(val){
                    // 只包含数字或字母
                    var rgx = /^(?!\d+$)(?![a-z]+$).+$/i;
                    return rgx.test(trim(val));
                }
            };
            return vd;
        })();
    var axiosInstance = axios.create({
            responseType: 'json'
        });
    axiosInstance.interceptors.request.use(function(config) {
        config.params = _tools.transKeyName('underline', config.params);
        config.data = _tools.transKeyName('underline', config.data);
        return config;
    });
    axiosInstance.interceptors.response.use(function(data) {
        data.data = _tools.transKeyName('camel', data.data);
        if(data && data.state && data.state.code == 20001) {
            bridge.invoking('informJianFangAppToRelogin');
        }
        return data.data;
    });

    var install = function(Vue) {
        var result = null;
        var _install = function(alias, plugin) {
            if(state.isDefinePropertyInObject){
                Object.defineProperty(Vue.prototype, alias, {value: plugin});
            }else {
                Vue.protytype[alias] = plugin;
            }
        };

        if(Vue && Vue.version) {

            _install('$setting', _setting);
            // axios插件实例挂载到Vue的原型链上
            _install('$http', axiosInstance);
            _install('$httpGet', function(url, data, config) {
                if(typeof url !== 'string') { alert('$httpGet:url错误.');return; }
                return axiosInstance.request({
                    url: url,
                    method:'get',
                    params:  data || {}
                });
            });
            _install('$httpPost', function(url, data, config) {
                if(typeof url !== 'string') { alert('$httpPost:url错误.');return; } 
                if(_setting.base) { // 正式
                    return axiosInstance.request({
                        url: url,
                        method:'post', 
                        data: data || {}
                    });
                }else { // 测试
                    return axiosInstance.request({
                        url: url,
                        method:'get', // 为了方便mock数据
                        params: data || {}
                    });
                }
            });

            // jsonp工具
            _install('$jsonp', function(url, params, cb, cberr){
                if(typeof params == 'function') {
                  cberr = cb;
                  cb = params;
                }
                if(typeof params == 'object') {
                  params = _tools.transKeyName('underline', params);
                }
                var concatParams = function (ps) {
                    var result = '';
                    if(ps) {
                      for(var i in ps) {
                        if(ps.hasOwnProperty(i)) {
                          result += '&' + i + '=' + (ps[i]?ps[i]:'');
                        }
                      };
                    }
                    if(result) {
                      result = result.substring(1);
                    }
                    return result;
                };
                var paramsStr = concatParams(params);
                if(paramsStr) {
                  url = url.indexOf('?') >= 0? (url + '&' + paramsStr) :  (url + '?' + paramsStr);
                }
                if(_setting.fp) {
                    $.ajax({
                        url: url,
                        dataType: 'jsonp'
                    }).done(function(data) {
                        if(cb && typeof cb == 'function') {
                            cb(_tools.transKeyName('camel', data));   
                        }
                    }).fail(function(err) {
                        if(cberr && typeof cberr == 'function') {
                            cberr(_tools.transKeyName('camel', err));
                        }
                    });           
                }else {
                    var data = params;
                    return axiosInstance.request({
                        url: url,
                        method:'get', // 为了方便mock数据
                        params: data || {}
                    }).then(function(res){
                        cb(res);
                    }, function(err) {
                        console.log(err);
                    });
                }
            });

            // 自定义工具
            _install('$tools', _tools);

            // 自定义工具
            _install('$vd', _validate);

            // 自定义alert
            _install('$myalert', function(title, callback){
                var docfrm = document.createElement('div');
                docfrm.innerHTML = '<div style="position:fixed;z-index:999;width:100%;height:calc(100% - 3.26rem);left:0;top:3.26rem;background:rgba(0,0,0,.4);">' +
                    '<div style="position:absolute;width:300px;left:50%;top: 50%;background-color:#fff;border-radius:.4rem;-webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);-o-transform: translate(-50%,-50%);transform: translate(-50%,-50%);">' +
                        '<p style="padding:1.3rem 2rem 1.7rem;font-size:1.03rem;color:#333;text-align:center;">'+ title +'</p>' +
                        '<a href="javascript:;" style="display:block;height:3rem;line-height:3rem;text-align:center;font-size:1.03rem;color:#1a8fc5;border-top:1px solid #e5e5e5;">确定</a>' +
                    '</div>' +
                '</div>';
                var alertBox = docfrm.firstChild,
                    closeBtn = alertBox.getElementsByTagName('a')[0];

                var cb = function(e){
                    if(callback && typeof callback == 'function') {
                        callback();
                    }
                    document.body.removeChild(alertBox);
                };
                if(closeBtn.addEventListener) {
                    closeBtn.addEventListener('click',cb,false);
                }
                if(closeBtn.attachEvent) {
                    closeBtn.attachEvent('onclick',cb);
                }

                document.body.appendChild(alertBox);
            });
        }else {
            throw 'install plugin fail.You have to pass the Vue constructor to this module.';
        }
    };
    install(Vue);
})(window);



