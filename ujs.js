/**
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * need support ECAMSCRIPT 5 or over
 * Author: XLON
 * Date: 2019-08-15
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module === 'object' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      typeof define === 'function' && define.cmd ? define(factory) :
        (global.ujs = factory(global))
})(typeof window !== 'undefined' ? window : this, function (window, noGlobal) {
  'use strict'
  let version = '1.0.0'

  let _ujs = new Proxy({}, {
    set(target, key, value, receiver) {
      // if (!_ujs.isString(key)) return
      // if (!_ujs.isFunction(value)) return
      return Reflect.set(target, key, value, receiver)
    },
    get(target, key, receiver) {
      return Reflect.get(target, key, receiver)
    }
  })

  // 事件分发class
  class EmitClass {
    constructor(opts) {
      this.eventEmits = {}
      this.onceEvent = {}
      this.maxListeners = 10
      this.mapEvent = {
        'loop': 'eventEmits',
        'once': 'onceEvent'
      }
    }

    // 绑定监听事件
    on(eventName, fn) {
      this.eventListen(eventName, fn, 'loop')
    }

    // 取消监听事件
    off(eventName, fn) {
      if (!_ujs.isString(eventName)) {
        console.error('TypeError: eventName is not String!')
        return
      }
      let cancelListen = (type) => {
        this[this.mapEvent[type]][eventName] = this[this.mapEvent[type]][eventName].filter((f, index) => {
          return f.toString().replace(/(\n|\s)/g, '') !== fn.toString().replace(/(\n|\s)/g, '')
        })
        if (!this[this.mapEvent[type]][eventName].length) {
          delete this[this.mapEvent[type]][eventName]
        }
      }
      if (eventName in this.eventEmits) {
        cancelListen('loop')
      }
      if (eventName in this.onceEvent) {
        cancelListen('once')
      }
    }

    // 绑定只一次的监听事件
    once(eventName, fn) {
      this.eventListen(eventName, fn, 'once')
    }

    // 监听事件订阅
    eventListen(eventName, fn, type) {
      if (!_ujs.isString(eventName)) {
        console.error('TypeError: eventName is not String!')
        return
      }
      if (!_ujs.isFunction(fn)) {
        console.error('TypeError: The fn is not Function')
        return
      }
      if (eventName in this[this.mapEvent[type]]) {
        if (this[this.mapEvent[type]][eventName].length < this.maxListeners) {
          this[this.mapEvent[type]][eventName].push(fn)
        } else {
          console.error('Overflow the max listenNums!')
        }
      } else {
        this[this.mapEvent[type]] = {...this[this.mapEvent[type]], ...{[eventName]: [fn]}}
        // this[this.mapEvent[type]][eventName] = [fn]
      }
    }

    // 事件执行
    emit(name, ...argv) {
      (name in this.eventEmits) && this.eventEmits[name].forEach(fn => fn(argv))
      if (name in this.onceEvent) {
        this.onceEvent[name].forEach(fn => fn(argv))
        delete this.onceEvent[name]
      }
    }

    // 最大监听事件数量
    set maxListenNums(num) {
      if (!_ujs.isNumber(num)) {
        console.error('TypeError: type is not number')
        return
      }
      this.maxListeners = num
    }

    get maxListenNums() {
      return this.maxListeners
    }

    // 获取当前所有监听的事件名称
    get _currentListenEventsName() {
      return Array.from(new Set([...Object.keys(this.eventEmits), ...Object.keys(this.onceEvent)]))
    }
  }

  // 注入自定义方法
  _ujs._insert = (name, fn) => {
    if (_ujs.hasOwnProperty(name)) {
      console.error('name is repeat, you need use another name!')
      return
    } else {
      _ujs[name] = fn
    }
  }

  // 是否为字符串
  _ujs.isString = (str) => {
    return Object.prototype.toString.call(str) === '[object String]'
  }

  // 是否为数字
  _ujs.isNumber = (number) => {
    return Object.prototype.toString.call(number) === '[object Number]'
  }

  // 是否为函数
  _ujs.isFunction = (fn) => {
    return Object.prototype.toString.call(fn) === '[object Function]'
  }

  // 是否为数组
  _ujs.isArray = (arr) => {
    return Object.prototype.toString.call(arr) === '[object Array]'
  }

  // 是否为对象
  _ujs.isObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }

  // 获取解析地址栏参数
  _ujs.httpParams = (address) => {
    let _Exgr = new RegExp(/[?|&]([a-zA-Z0-9_%*()+-.,])+=([a-zA-Z0-9_%*()+-.,])+/g)
    let _ArrData = address.match(_Exgr)
    let _Obj = {}
    for (let i = 0; i < _ArrData.length; i++) {
      let _dt = _ArrData[i].replace(/^[?|&]/, '').split('=')
      _Obj[_dt[0]] = decodeURIComponent(_dt[1])
    }
    return _Obj
  }

  // 深度copy对象
  _ujs.copy = (obj) => {
    let _obj = {}
    let fn = (_ct, o) => {
      for (let i in _ct) {
        o[i] = _ct[i]
        if (_ujs.isObject(_ct[i])) {
          fn(_ct[i], o[i])
        }
      }
    }
    fn(obj, _obj)
    return _obj
  }

  // 格式化参数
  _ujs.formatParams = (data) => {
    if (!_ujs.isObject(data)) {
      console.error('TypeError: argument is not a object')
      return
    }
    let _data = []
    Object.keys(data).forEach(it => {
      _data.push(`${it}=${encodeURIComponent(data[it])}`)
    })
    return _data.join('&')
  }

  // 文件下载
  _ujs.downloadFile = ({url, method, headers = {}, progressCallback}) => {
    let req = new XMLHttpRequest()
    req.open(method, url, true)
    req.responseType = 'blob'
    // 监听下载进度
    req.addEventListener('progress', (e) => {
      let precent = e.loaded / e.total * 100.00
      if (_ujs.isFunction(progressCallback)) {
        progressCallback(precent)
      }
    })
    req.onerror = (err) => {
      console.error(err)
    }
    req.onreadystatechange = () => {
      if (req.readyState === 4 && req.status === 200) {
        let URL = window.URL || window.webkitURL || window
        let link = document.createElement('a')
        let name = (function (ct) {
          return ct[ct.length - 1].replace(/\.(\w)+/, '')
        })(url.split('/'))
        console.log(name)
        link.href = URL.createObjectURL(req.response)
        link.download = name
        // ie, firefox和chrome都兼容
        let events = document.createEvent('MouseEvents')
        events.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        link.dispatchEvent(events)
      }
    }
    req.send()
  }

  // ajax后台数据请求
  _ujs.ajax = ({url, method, headers = {}, data = {}, type}) => {
    return new Promise((resolve, reject) => {
      // if (!_ujs.isObject(data) || !_ujs.isObject(headers)) reject('TypeError: params data or headers is not object')
      if (!_ujs.isString(url) || !_ujs.isString(method)) reject('TypeError: params url or method is not string')
      method = method.toLocaleLowerCase()
      if (method === 'get') {
        url += '?' + _ujs.formatParams(data)
      }
      const xhr = new XMLHttpRequest()
      xhr.open(method, url, true)
      if (typeof headers !== 'undefined' && _ujs.isObject(headers)) {
        Object.keys(headers).forEach(name => {
          xhr.setRequestHeader(name, headers[name])
        })
      }
      xhr.responseType = 'json'
      xhr.onreadystatechange = () => {
        if (method === 'head') {
          if (xhr.readyState === 2) {
            // 获取返回头信息
            resolve(xhr.getAllResponseHeaders())
          }
        } else {
          if (xhr.readyState === 4 && xhr.status === 200) {
            if (xhr.response) {
              let {code, message} = xhr.response
              if (code !== 200) {
                reject(message ? message : '接口错误')
              }
            }
            resolve(xhr.response)
          }
        }
      }
      xhr.onerror = (err) => {
        reject(err)
      }
      if (type && type === 'upload') {
        xhr.upload.addEventListener('progress', (e) => {
          console.log(e)
        })
      }
      if (method === 'post') {
        xhr.send(type && type === 'upload' ? data : JSON.stringify(data))
      } else {
        xhr.send()
      }
    })
  }

  // 上传文件
  _ujs.uploadFile = ({url, file, type, ...argv}) => {
    // const _readFile = new FileReader()
    // _readFile.onload = (e) => {
    // }
    return new Promise((resolve, reject) => {
      const _form = new FormData()
      let _blob = new Blob([file], {type})
      _form.append('file', file)
      _form.append('blob', _blob)
      if (argv && _ujs.isObject(argv)) {
        Object.keys(argv).forEach(v => {
          _form.append(v, argv[v])
        })
      }
      _ujs.ajax({url, method: 'post', data: _form, type: 'upload'}).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }


  _ujs.EmitClass = EmitClass    // 事件监听及分发
  _ujs.version = version

  // Object.keys(_ujs).forEach(it => {
  //   Object.prototype[it] = _ujs[it]
  // })

  if (!noGlobal) {
    window.ujs = _ujs
  }

  return ujs
})