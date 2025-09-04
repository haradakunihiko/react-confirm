import React, { useState } from 'react';
import type { ConfirmableProps, ConfirmDialog, ConfirmableDialog } from './types';

const confirmable: <P, R>(Component: ConfirmDialog<P, R>) => ConfirmableDialog<P, R> =
<P, R>(Component: ConfirmDialog<P, R>) =>
  ({ dispose, reject, resolve, ...other }: ConfirmableProps<P, R>) => {
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
