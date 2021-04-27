"use strict";

var _definePropertyVersion = require("./defineProperty-version");

var _proxyVersion = require("./proxy-version");

function testArr() {
  var arr = (0, _definePropertyVersion.observable)([1, 2, 3]);
  arr[0] = 'fuck';
  (0, _definePropertyVersion.autorun)(function () {
    console.log(arr[0]);
  });
  (0, _definePropertyVersion.autorun)(function () {
    // autorun会先执行一次
    console.log(arr[2]);
  });
  arr[2] = 'u';
  (0, _definePropertyVersion.autorun)(function () {
    // 对于数组新增的元素，第一次是undefined，没有第二次（不执行，监听不到）
    console.log(arr[3]);
  });
  arr[3] = '!!';
}

function testObj() {
  var store = (0, _proxyVersion.observable)({
    a: 1,
    b: {
      c: 1
    }
  });
  (0, _proxyVersion.autorun)(function () {
    if (store.a === 2) {
      console.log(store.b.c);
    }
  });
  store.a = 2; // store.b.c = 5
  // store.b.c = 6
}

testArr();
testObj();