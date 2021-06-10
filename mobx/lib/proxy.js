"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observable = exports.autorun = void 0;

var _eventEmitter = require("@pky/fe-utils/dist/event-emitter");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var em = new _eventEmitter.EventEmitter();
var currentFn;
var obId = 1;

var autorun = function autorun(fn) {
  // currentFn = fn
  // fn()
  // currentFn = null
  // 在 autorun 以及对可观察对象的值修改时都要需要做依赖收集
  var warpFn = function warpFn() {
    currentFn = warpFn;
    fn();
    currentFn = null;
  };

  warpFn();
}; // 使用WeakMap是为了解决记录每个key的问题


exports.autorun = autorun;
var map = new WeakMap(); // 比起defineProperty好处： 不用遍历

var observable = function observable(obj) {
  return new Proxy(obj, {
    get: function get(target, propKey) {
      if (_typeof(target[propKey]) === 'object') {
        return observable(target[propKey]);
      } else {
        if (currentFn) {
          var id = String(obId++);

          if (!map.get(target)) {
            map.set(target, _defineProperty({}, propKey, id));
          }

          em.on(id, currentFn);
        }

        return target[propKey];
      }
    },
    set: function set(target, propKey, value) {
      if (target[propKey] !== value) {
        target[propKey] = value;
        var mapObj = map.get(target);

        if (mapObj && mapObj[propKey]) {
          em.emit(mapObj[propKey]);
        }
      }

      return true;
    }
  });
};

exports.observable = observable;