"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Provider;

var _react = _interopRequireDefault(require("react"));

var _context = _interopRequireDefault(require("./context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function Provider(props) {
  var store = props.store,
      children = props.children; // 这是要传递的context

  var contextValue = {
    store: store
  }; // 返回ReactReduxContext包裹的组件，传入contextValue
  // 里面的内容就直接是children，我们不动他

  return /*#__PURE__*/_react["default"].createElement(_context["default"].Provider, {
    value: contextValue
  }, children);
}