"use strict";

var _proxy = require("./proxy");

// 测试proxy版本

/***************************对象**************************** */
var obj = (0, _proxy.observable)({
  a: 1
});
(0, _proxy.autorun)(function () {
  console.log(obj.b);
}); // 支持监听新增的属性

obj.b = 2;
/***************************数组**************************** */

var arr = (0, _proxy.observable)([1, 2]);
(0, _proxy.autorun)(function () {
  console.log(arr[2]);
}); // 支持数组方法

arr.push(3);