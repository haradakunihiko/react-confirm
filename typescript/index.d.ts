import * as React from "react";

export function confirmable<
    ConfirmationProps = any,
    ProceedResposne = any
>(
    component: React.ComponentType<ReactConfirmProps<ConfirmationProps, ProceedResposne>>
): React.ComponentType<ConfirmableProps & ConfirmationProps>;

export function createConfirmation<
    ConfirmationProps = any,
    ConfirmResposne = any
>(
    component: React.ComponentType<ConfirmableProps & ConfirmationProps>,
    unmountDelay?: number,
    mountingNode?: any
): (props: ConfirmationProps) => Promise<ConfirmResposne>;

export type ReactConfirmProps<
    Props = any,
    ProceedResponse = any,
> = {
    dismiss: () => void;
    proceed: (value?: ProceedResponse) => void;
    cancel: (value?: any) => void;
    show: boolean;
} & Props;

export interface ConfirmableProps {
    dispose: () => void;
    resolve: PromiseConstructor["resolve"];
    reject: PromiseConstructor["reject"];
}