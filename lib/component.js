'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

require('select2');

exports['default'] = _react2['default'].createClass({
  displayName: 'component',

  propTypes: {
    children: _react2['default'].PropTypes.element.isRequired,
    data: _react2['default'].PropTypes.object,
    fixBootstrapModal: _react2['default'].PropTypes.bool,
    onChange: _react2['default'].PropTypes.func,
    onOpen: _react2['default'].PropTypes.func,
    onClose: _react2['default'].PropTypes.func,
    onSelect: _react2['default'].PropTypes.func,
    onUnselect: _react2['default'].PropTypes.func,
    multiple: _react2['default'].PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      data: {},
      fixBootstrapModal: true,
      multiple: false
    };
  },

  getInitialState: function getInitialState() {
    return {
      events: {
        onChange: 'change',
        onOpen: 'select2:open',
        onClose: 'select2:close',
        onSelect: 'select2:select',
        onUnselect: 'select2:unselect'
      }
    };
  },

  runSelect2: function runSelect2() {
    var data = arguments.length <= 0 || arguments[0] === undefined ? this.props.data : arguments[0];

    var elem = (0, _jquery2['default'])(_reactDom2['default'].findDOMNode(this));
    (0, _jquery2['default'])(elem).unbind();
    this._select2 = elem.select2(data);

    // Dirty hack for react-bootstrap modal window
    // https://github.com/react-bootstrap/react-bootstrap/issues/1455
    if (this.props.fixBootstrapModal && !this.props.multiple && (typeof data.multiple === undefined || !data.multiple)) {
      (0, _jquery2['default'])('.inmodal').removeAttr('tabindex');
    }

    function makeEventHandler(handlers, eventName) {
      return (0, _jquery2['default'])(elem).on(eventName, function (ev) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = handlers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var eventHandler = _step.value;

            if (typeof eventHandler === 'function') {
              eventHandler.apply(null, [ev, (0, _jquery2['default'])(elem).select2('data'), (0, _jquery2['default'])(elem).val()]);
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      });
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = Object.entries(this.state.events)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _step2$value = _slicedToArray(_step2.value, 2);

        var eventOnProps = _step2$value[0];
        var eventOnSelect2 = _step2$value[1];

        var componentEvent = this.props[eventOnProps];
        var childEvent = this.props.children.props[eventOnProps];

        if (componentEvent || childEvent) {
          makeEventHandler([componentEvent, childEvent], eventOnSelect2);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  },

  componentDidMount: function componentDidMount() {
    this.runSelect2();
  },

  componentDidUpdate: function componentDidUpdate() {
    this.runSelect2();
  },

  componentWillUpdate: function componentWillUpdate() {
    var elem = (0, _jquery2['default'])(_reactDom2['default'].findDOMNode(this));
    // Dirty hack, remove new options that was added in DOM by select2
    elem.find('option:not([data-reactid])').remove();
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data;
  },

  componentWillUnmount: function componentWillUnmount() {
    this._select2.select2('destroy');
  },

  render: function render() {
    return this.props.children;
  }
});
module.exports = exports['default'];