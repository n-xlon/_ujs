## ujs - 各类方法集

### 调用方法
```javascript
// common.js方式
const ujs = require('ujs')

// 直接调用
<script src="ujs.js"></script>
```
- #### EmitClass 事件监听
```javascript
const ujs = require('ujs')
const Events = new ujs.EmitClass()

Events.on(name, fn) // 注册监听方法
Events.once(name, fn) // 注册仅一次的监听方法
Events.emit(name, argv) // 事件分发
Events.off(name, fn) // 取消当前监听事件
Events.maxListenNums = nums // 设置最大监听数
Events._currentListenEventsName // 获取当前所有监听事件名称
```
- #### insert 方法
```javascript
// 向ujs对象注入自定义方法
ujs.insert(name, fn)
```
- #### 变量类型判定
```javascript
isString() // 是否为字符串
isObject() // 是否为对象
isFunction() // 是否为函数 
isArray() // 是否为数组
isNumber() // 是否为数字
isHas() // 数组或对象中是否有已知值
isMail() // 检测邮箱格式是否正确
isUndefined() // 变量是否存在
```
- #### 解析地址栏参数
```javascript
/**
* return {object} {参数名， 值}
*/
ujs.httpParams()
```
- #### 格式化参数
```javascript
ujs.formatParams(params) // 拼接成name=xxx&num=1格式 
```
- #### 对象深度copy
```javascript
ujs.copy(obj)
```
- #### 文件下载
```javascript
/**
* params url {string} 下载地址
* params method {string} 请求方式（post，get，head等）
* params header {Object} 请求头信息
* params progressCallback {Function} 下载进度callback
*/
ujs.downloadFile({url, method, headers, progressCallback})
```
- #### ajax请求
```javascript
/**
* params url {string} 请求地址
* params method {string} 请求方式（post，get，head等）
* params header {Object} 请求头信息
* params data {Object} 请求参数
* params type {string} 类型（区分上传与一般接口请求）
*/
ujs.ajax({url, method, headers, data, type})
```
- #### uploadFile 文件上传
```javascript
/**
* params url {string} 上传地址
* params file 文件
* params type {string} 文件类型
* params argv 扩展参数（需写入FormData中的）
*/
ujs.uploadFile({url, file, type, argv})
```
- #### sort 数组排序（二分法快速排序）
```javascript
ujs.sort([...argvs])
```
- #### formatDate 自定义日期格式
```javascript
const date = ujs.formatDate({format: 'yyyy-mm-dd'})
console.log(date)
'2019-08-24'
```