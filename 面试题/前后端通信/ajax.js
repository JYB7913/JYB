~function () {
    //自己封装的合并对象
    Object.myAssign = function (tar, source) {
        for (let k in source) {
            if (source.hasOwnProperty(k)) {
                tar[k] = source[k]
            }
        }
    };
    function createXhr() {
        let arr = [function () {
            return new XMLHttpRequest();
        }, function () {
            return new ActiveXObject(',Microsoft.XMLHTTP');
        }, function () {
            return new ActiveXObject('Msxml2.HTTPXML');
        }, function () {
            return new ActiveXObject('Msxml3.XMLHTTP')
        }];
        let xhr = null, createFn = null;
        for (let i = 0; i < arr.length; i++) {
            try {
                createFn = arr[i];
                xhr = createFn();
                createXhr = createFn;
                break;
            } catch (e) {

            }
            if (!xhr) {
                throw new Error('请升级浏览器');
            }
        }
        return xhr;
    }

    function ajax(options) {
        let _options = {
            url: null,
            type: 'GET',
            cache: true,
            async: true,
            data: null,
            dataType: 'text',
            success: null,
            timeout: null,
            error: null,
            context: null
        };
        //Object.assign(_options,options);//Object 提供的对象合并
        Object.myAssign(_options, options);//对象合并
        if (!_options.url) {
            console.warn('没有请求地址');
            return;
        }
        let flag = false;
        //直接把_options.url地址后面的？去掉
        if (_options.url.indexOf('?') > -1) {
            _options.url = _options.url.slice(0, -1);
        }
        //请求方式为 GET
        if (_options.type.toUpperCase() === 'GET') {
            if (!_options.cache) {//不需要缓存 拼接时间戳
                _options.url += '?_=' + Date.now();
                flag = true;
            }
            //拼接参数
            for (let k in _options.data) {
                if (_options.data.hasOwnProperty(k)) {
                    if (flag) {//有？ 直接&拼接参数
                        _options.url += '&' + k + "=" + _options.data[k];
                    } else {//没有？ 需拼接？再&拼接参数
                        _options.url += '?' + '&' + k + "=" + _options.data[k];
                        flag = true;
                    }
                }
            }
        }
        //创建ajax实例
        let xhr = createXhr();
        let {url, type, async, data, dataType, timeout, error, success, context} = _options;
        context || (context = _options);
        xhr.open(type, url, async);
        xhr.dataType = dataType;
        xhr.timeout = timeout;
        xhr.onerror = xhr.ontimeout = error;
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && /^2\d{2}$/.test(this.status)) {
                typeof success === 'function' ? success.call(context, this.response) : null;
            }
        };
        //post 直接将参数对象放在send里面
        xhr.send(JSON.stringify(data));
    }

    window.$$ = {ajax}
}();
