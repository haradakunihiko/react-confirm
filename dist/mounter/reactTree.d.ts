import * as React from 'react';
import type { Mounter } from '../createConfirmation';
export type TreeMounter = {
    options: {
        setMountedCallback: (callback: (components: any) => void) => void;
        mountNode?: Element | DocumentFragment | HTMLElement;
    };
} & Mounter;
export declare function createReactTreeMounter(mountNode?: Element | DocumentFragment | HTMLElement): TreeMounter;
export declare function createMountPoint(reactTreeMounter: TreeMounter): React.ComponentType;
