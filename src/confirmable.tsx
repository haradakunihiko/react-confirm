import React, { useState } from 'react';

type ConfirmableProps<P, R> = {
    dispose: () => void;
    resolve: (value: R | PromiseLike<R>) => void;
    reject: (reason?: any) => void;
} & P;

export type ConfirmDialogProps<P, R> = {
  /** Dismiss dialog without resolving the promise. */
  dismiss: () => void;
  /** Resolve the promise with the given value. */
  proceed: (value: R) => void;
  /** Reject the promise with the given value. */
  cancel: (value?: any) => void;
  /** Indicates if the dialog should be shown aka. someone is waiting for a promise. */
  show: boolean;
} & P;

export type ConfirmDialog<P, R> = React.ComponentType<ConfirmDialogProps<P, R>>;
export type ConfirmableDialog<P, R> = React.ComponentType<ConfirmableProps<P, R>>;

const confirmable = <P, R>(Component: ConfirmDialog<P, R>) => (
  { dispose, reject, resolve, ...other }: ConfirmableProps<P, R>
) => {
  const [show, setShow] = useState(true);

  const dismiss = () => {
    setShow(false);
    dispose();
  };

  const cancel = (value?: any) => {
    setShow(false);
    reject(value);
  };

  const proceed = (value: R) => {
    setShow(false);
    resolve(value);
  };

  return (
    <Component
      cancel={cancel}
      dismiss={dismiss}
      proceed={proceed}
      show={show}
      {...(other as P)}
    />
  );
};

export default confirmable;