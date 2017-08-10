import React from 'react';
import ReactDOM from 'react-dom';

const createConfirmation = (Component, unmountDelay) => {
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

    const unmountDelay = (typeof unmountDelay === 'undefined') ? 0 : unmountDelay;

    function dispose() {
      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(wrapper);
        setTimeout(() => wrapper.remove());
      }, unmountDelay);
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
