import $ from 'jquery';
import React, { cloneElement } from 'react';
import ReactDOM from 'react-dom';
require('select2');

export default React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
    data: React.PropTypes.object,
    fixBootstrapModal: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    onOpen: React.PropTypes.func,
    onClose: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    onUnselect: React.PropTypes.func,
    multiple: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      data: {},
      fixBootstrapModal: true,
      multiple: false
    };
  },

  getInitialState() {
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

  runSelect2(data=this.props.data) {
    let elem = $(ReactDOM.findDOMNode(this));
    $(elem).unbind();
    this._select2 = elem.select2(data);

    // Dirty hack for react-bootstrap modal window
    // https://github.com/react-bootstrap/react-bootstrap/issues/1455
    if (this.props.fixBootstrapModal && !this.props.multiple && (typeof data.multiple === undefined || !data.multiple)) {
      $('.inmodal').removeAttr('tabindex');
    }

    function makeEventHandler(handlers, eventName) {
      return $(elem).on(eventName, (ev) => {
        for (let eventHandler of handlers) {
          if (typeof eventHandler === 'function') {
            eventHandler.apply(null, [ev, $(elem).select2('data'), $(elem).val()]);
          }
        }
      });
    }

    for (let [eventOnProps, eventOnSelect2] of Object.entries(this.state.events)) {
      let componentEvent = this.props[eventOnProps];
      let childEvent = this.props.children.props[eventOnProps];

      if (componentEvent || childEvent) {
        makeEventHandler([componentEvent, childEvent], eventOnSelect2);
      }
    }
  },

  componentDidMount() {
    this.runSelect2();
  },

  componentDidUpdate() {
    this.runSelect2();
  },

  componentWillUpdate() {
    let elem = $(ReactDOM.findDOMNode(this));
    // Dirty hack, remove new options that was added in DOM by select2
    elem.find('option:not([data-reactid])').remove();
  },

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.data !== nextProps.data);
  },

  componentWillUnmount(){
    this._select2.select2('destroy');
  },

  render() {
    return this.props.children;
  }
});
