'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createConfirmation = function createConfirmation(Component) {
  return function (props) {
    var wrapper = document.body.appendChild(document.createElement('div'));

    var promise = new Promise(function (resolve, reject) {
      try {
        _reactDom2.default.render(_react2.default.createElement(Component, _extends({
          reject: reject,
          resolve: resolve,
          dispose: dispose
        }, props)), wrapper);
      } catch (e) {
        console.error(e);
        throw e;
      }
    });

    function dispose() {
      setTimeout(function () {
        _reactDom2.default.unmountComponentAtNode(wrapper);
        setTimeout(function () {
          return wrapper.remove();
        });
      }, 1000);
    }

    return promise.then(function (result) {
      dispose();
      return result;
    }, function (result) {
      dispose();
      return Promise.reject(result);
    });
  };
};

exports.default = createConfirmation;