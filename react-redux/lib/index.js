"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Provider", {
  enumerable: true,
  get: function get() {
    return _provider["default"];
  }
});
Object.defineProperty(exports, "connect", {
  enumerable: true,
  get: function get() {
    return _connect["default"];
  }
});

var _provider = _interopRequireDefault(require("./provider"));

var _connect = _interopRequireDefault(require("./connect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log(_connect["default"]);