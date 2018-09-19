import React from 'react';
import ReactDOM from 'react-dom';

const createConfirmation = (Component, unmountDelay = 1000, mountingNode) => {
  return (props) => {
    const wrapper = (mountingNode || document.body).appendChild(document.createElement('div'));

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
        setTimeout(() => document.body.removeChild(wrapper));
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
