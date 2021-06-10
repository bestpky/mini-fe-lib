"use strict";

var _defineProperty = require("./defineProperty");

// 测试defineProperty版本数组
function test() {
  var arr = (0, _defineProperty.observable)([1, 2, 3]);
  arr[0] = 'i';
  (0, _defineProperty.autorun)(function () {
    // 如果在依赖收集前改，只会执行一次，输出i
    console.log(arr[0], 111);
  });
  (0, _defineProperty.autorun)(function () {
    // autorun会先执行一次，输出3、love
    console.log(arr[2], 222);
  });
  arr[2] = 'love';
  (0, _defineProperty.autorun)(function () {
    // 对于数组新增的元素，第一次是undefined，没有第二次（不执行，监听不到）
    console.log(arr[3], 333);
  });
  arr[3] = 'u';
  (0, _defineProperty.autorun)(function () {
    // 对于数组新增的元素，第一次是undefined，没有第二次（不执行，监听不到）
    console.log(arr[4], 444);
  });
  arr.push(4);
}

test();