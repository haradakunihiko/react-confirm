import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom';

export function createReactTreeMounter(mountNode) {
    const confirms = {};
    const callbacks = {};

    function mount(Component, props, mountNode){
        const key = Math.floor(Math.random() * (1 << 30)).toString(16);
        confirms[key] = { Component, props};
        callbacks.mounted && callbacks.mounted(confirms);
        return key;
        // mountNode is ignored - ReactTreeMounter uses options.mountNode instead
    }
    function unmount(key) {
        delete confirms[key];
        callbacks.mounted && callbacks.mounted(confirms);
    }

    function setMountedCallback(func) {
        callbacks.mounted = func;
    }

    return {
        mount, unmount,
        options: {
            setMountedCallback, mountNode
        }
    }
}

export function createMountPoint(reactTreeMounter) {
    return () => {
        const [confirmComponents, setConfirmComponents] = useState({});

        useEffect(() => {
            return reactTreeMounter.options.setMountedCallback((components) => {
                setConfirmComponents({...components});
            });
         }, []);

         let element = (
            <>
                {Object.keys(confirmComponents).map((key) => {
                    const { Component, props } = confirmComponents[key];
                    return <Component key={key} {...props} />
                })}
            </>
         )
         if (reactTreeMounter.options.mountNode) {
            element = createPortal(element, reactTreeMounter.options.mountNode);
         }

         return element;
    }
}
