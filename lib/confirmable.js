'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var confirmable = function confirmable(Component) {
  return (function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
      _classCallCheck(this, _class);

      _React$Component.call(this, props);

      this.state = {
        show: true
      };
    }

    _class.prototype.dismiss = function dismiss() {
      var _this = this;

      this.setState({
        show: false
      }, function () {
        _this.props.dispose();
      });
    };

    _class.prototype.cancel = function cancel(value) {
      var _this2 = this;

      this.setState({
        show: false
      }, function () {
        _this2.props.reject(value);
      });
    };

    _class.prototype.proceed = function proceed(value) {
      var _this3 = this;

      this.setState({
        show: false
      }, function () {
        _this3.props.resolve(value);
      });
    };

    _class.prototype.render = function render() {
      return _react2['default'].createElement(Component, _extends({ proceed: this.proceed.bind(this), dismiss: this.dismiss.bind(this), show: this.state.show }, this.props));
    };

    return _class;
  })(_react2['default'].Component);
};

exports['default'] = confirmable;
module.exports = exports['default'];