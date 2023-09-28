import React from 'react';
import { render } from 'react-dom';

export function createDomTreeMounter(defaultMountNode) {
    const confirms = {};
    const callbacks = {};

    function mount(Component, props, mountNode){
        const key = Math.floor(Math.random() * (1 << 30)).toString(16);
        const wrapper = (mountNode || defaultMountNode || document.body).appendChild(document.createElement('div'));
        confirms[key] = wrapper;

        render(
            <Component
              {...props}
            />,
            wrapper
        );
        callbacks.mounted && callbacks.mounted();
        return key;
    }

    function unmount(key) {
        const wrapper = confirms[key];
        delete confirms[key];
        
        if (wrapper && wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper);
        }
    }
    return {
        mount, unmount, options: {}
    }
}
