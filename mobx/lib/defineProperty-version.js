"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observable = exports.autorun = void 0;

var _event = _interopRequireDefault(require("./event"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// 原理：每defineProperty一个属性时全局的obId会递增
var em = new _event["default"]();
var currentFn;
var obId = 1;

var observable = function observable(obj) {
  // 用 Symbol 当 key；这样就不会被枚举到，仅用于值的存储；
  var data = Symbol('data');
  obj[data] = JSON.parse(JSON.stringify(obj));
  Object.keys(obj).forEach(function (key) {
    if (_typeof(obj[key]) === 'object') {
      observable(obj[key]);
    } else {
      // 每个 key 都生成唯一的 channel ID
      var id = String(obId++);
      Object.defineProperty(obj, key, {
        get: function get() {
          if (currentFn) {
            em.on(id, currentFn);
          }

          return this[data][key];
        },
        set: function set(v) {
          // 值不变时不触发
          if (this[data][key] !== v) {
            this[data][key] = v;
            em.emit(id);
          }
        }
      });
    }
  });
  return obj;
};

exports.observable = observable;

var autorun = function autorun(fn) {
  // 在 autorun 以及对可观察对象的值修改时都要需要做依赖收集
  var warpFn = function warpFn() {
    currentFn = warpFn;
    fn();
    currentFn = null;
  };

  warpFn();
};

exports.autorun = autorun;