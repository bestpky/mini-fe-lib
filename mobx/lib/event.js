"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = EventEmitter;

/**
 * 发布订阅模式的事件模型
 */
function EventEmitter() {
  this.events = {};
}

EventEmitter.prototype.on = function (type, cb) {
  this.events[type] ? this.events[type].push(cb) : this.events[type] = [cb];
  return this;
};

EventEmitter.prototype.emit = function (type) {
  for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  if (this.events[type]) {
    this.events[type].forEach(function (cb) {
      cb.apply(void 0, rest);
    });
  }

  return this;
};

EventEmitter.prototype.off = function (type, fn) {
  var fns = this.events[type];

  if (fns) {
    for (var i = 0; i < fns.length; i++) {
      if (fns[i] === fn) {
        fns.splice(i, 1);
        break;
      }
    }
  }

  return this;
};