import React from 'react';
import ReactDOM from 'react-dom';

// add IE support
if (!window.Promise) {
  var Promise = require("bluebird");
  window.Promise = Promise;
}

const createConfirmation = (Component) => {
  return (props) => {
    const wrapper = document.body.appendChild(document.createElement('div'));

    const promise = new Promise((resolve, reject) => {
      try {
        ReactDOM.render(
          <Component
            reject={reject}
            resolve={resolve}
            dispose={dispose}
            {...props}
          />,
          wrapper
        );
      } catch (e) {
        console.error(e);
        throw e;
      }
    })

    function dispose() {
      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(wrapper);
        setTimeout(() => wrapper.remove());
      }, 1000);
    }

    return promise.then((result) => {
      dispose();
      return result;
    }, (result) => {
      dispose();
      return Promise.reject(result);
    });
  }
}

export default createConfirmation;
