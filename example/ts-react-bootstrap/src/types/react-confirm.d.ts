import * as React from "react";

export function confirmable<P, Q = any>(component: React.ComponentType<ReactConfirmProps<Q> & P>): React.ComponentType<ConfirmableProps & P>;
export function createConfirmation<P, Q = any>(component: React.ComponentType<ConfirmableProps & P>, unmountDelay?: number, mountingNode?: any): (props: P) => Promise<Q>;

export interface ReactConfirmProps<Q = any>{
    dismiss: () => void;
    proceed: (value?: Q) => void;
    cancel: (value?: any) => void;
    show: boolean;
}

export interface ConfirmableProps extends Pick<PromiseConstructor, "reject" | "resolve"> {
    dispose: () => void;
}
