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
        /*var str = '';
        str += 'window.webkit: ' + typeof win.webkit;
        try {
            str += '\nwindow.webkit.messageHandlers: ' + typeof win.webkit.messageHandlers;
        } catch (e) {
            str += '\nwindow.webkit.messageHandlers: 无法读取';
        }
        try {
            str += '\nwindow.webkit.messageHandlers[\'' + type + '\']: ' + typeof win.webkit.messageHandlers[type];
        } catch (e) {
            str += '\nwindow.webkit.messageHandlers[\'' + type + '\']: 无法读取';
        }
        alert(str);
        if (win.webkit && win.webkit.messageHandlers && win.webkit.messageHandlers[type]) {
            win.webkit.messageHandlers[type](dataString);
        } else */ if (win.jsBridge && win.jsBridge[type]) {
            win.jsBridge[type](dataString);
        }
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

    /**
     * 注册回调
     * @param {String} type
     * @param {Function} callback
     */
    /*Bridge.prototype.register = function (type, callback) {
        var that = this;
        if (typeof this._callbacks[type] == 'undefined') {
            this._callbacks[type] = 'once';
            var name = 'cb' + this.count++ + type;
            this[name] = function (res) {
                var data = typeof res == 'string' ? JSON.parse(res) : res;
                callback(data);
            };
            if (win.webkit && win.webkit.messageHandlers && win.webkit.messageHandlers[type]) {
                win.webkit.messageHandlers[type]('{"_callbackName":"bridge.' + name + '"}');
            } else if (win.jsBridge && win.jsBridge[type]) {
                win.jsBridge[type]('{"_callbackName":"bridge.' + name + '"}');
            }
        } else {
            throw new Error('bridge.register 只接受全局单一注册，重复注册回调请在 bridge.invoking 中进行');
        }
    };*/

    return win.bridge = new Bridge();

})(window);