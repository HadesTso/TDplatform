/**
 * Bridge
 * @author Tevin
 */

;(function (win) {

    /**
     * Bridge
     * @constructor
     */
    var Bridge = function () {
        this._callbacks = {};
        this.count = 100;
    };

    /**
     * 发起
     * @param {String} type
     * @param {Object|Function} [data]
     * @param {Function} [callback]
     */
    Bridge.prototype.invoking = function (type, data, callback) {
        //数据检查
        if (data) {
            if (Object.prototype.toString.call(data) == '[object Function]') {
                callback = data;
                data = {};
            } else if (Object.prototype.toString.call(data) != '[object Object]') {
                throw new Error('bridge.invoking 需要接受 JSON 对象！');
            }
        }
        //如果有回调，转存回调
        if (typeof callback != 'undefined') {
            if (typeof this._callbacks[type] == 'undefined') {
                this._callbacks[type] = 'every';
            } else if (this._callbacks[type] == 'once') {
                throw new Error('类型 ' + type + ' 已经被 bridge.register 注册');
            }
            var name = 'cb' + this.count++ + 'at' + Date.now();
            data['_callbackName'] = 'bridge.' + name;
            this[name] = function (res) {
                var data = typeof res == 'string' ? JSON.parse(res) : res;
                callback(data);
                delete this[name];
            }
        }
        if (data) {
            var dataString = typeof data != 'string' ? JSON.stringify(data) : data;
        }
        var isIOS = (function() {
            var ua = navigator.userAgent.toLowerCase();
            if(ua.match(/(ipad|ipod|iphone)/i) != null) {
                return true;
            }else {
                return false;
            }
        })();
        // if(isIOS) {
        //     var version = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        //     try{
        //         version = parseInt(version[0].replace('OS ', ''), 10);
        //     }catch(e) {version = '';}
        //     if (version >= 7.0 && version < 8.0) {
        //         if (win.jsBridge && win.jsBridge[type]) {
        //             win.jsBridge[type](dataString || '');
        //         }
        //     }else if(version >= 8.0){
        //         if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers[type]) {
        //             window.webkit.messageHandlers[type].postMessage(dataString || ' ');
        //         }
        //     }            
        // }else {
            if(win.jsBridge && win.jsBridge[type]) {
                win.jsBridge[type](dataString || '');
            }
        // } 

    };

    /**
     * 注册app调用api
     * @param {String} type
     * @param {Function} callback
     */
    Bridge.prototype.on = function(type, callback) {
        if(!type){throw new Error('bridge.on方法需要传入绑定类型！');}
        if(typeof this[type] == 'undefined') {
            this[type] = function(res) {
                try{
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                }catch(e) {
                    res = res;
                }
                if(!res.state) { // 兼容ios的数据格式
                    res = {
                        state: {
                            code: 10200,
                            msg: ''
                        },
                        data: res
                    };
                }
                callback(res);
            };
        }else {
            throw new Error('bridge. '+ type +'类型事件已经存在！');
        }
    };

    return win.bridge = new Bridge();

})(window);