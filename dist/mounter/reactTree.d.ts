import type { TreeMounter } from '../types';
export declare function createReactTreeMounter(mountNode?: Element | DocumentFragment | HTMLElement): TreeMounter;
export declare function createMountPoint(reactTreeMounter: TreeMounter): () => import("react/jsx-runtime").JSX.Element;
