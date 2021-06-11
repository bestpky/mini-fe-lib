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
var map = new WeakMap();

var autorun = function autorun(fn) {
  var warpFn = function warpFn() {
    currentFn = warpFn;
    fn();
    currentFn = null;
  };

  warpFn();
};

exports.autorun = autorun;

var observable = function observable(obj) {
  return new Proxy(obj, {
    get: function get(target, key) {
      if (_typeof(target[key]) === 'object') {
        return observable(target[key]);
      } else {
        if (currentFn) {
          var id = String(obId++);

          if (!map.get(target)) {
            map.set(target, _defineProperty({}, key, id));
          }

          em.on(id, currentFn);
        }

        return target[key];
      }
    },
    set: function set(target, key, value) {
      if (target[key] !== value) {
        target[key] = value;
        var mapObj = map.get(target);

        if (mapObj && mapObj[key]) {
          em.emit(mapObj[key]);
        }
      }

      return true;
    }
  });
};

exports.observable = observable;