import React, {useState} from 'react';

const confirmable = (Component) => ({dispose, reject, resolve, ...other}) => {
  const [show, setShow] = useState(true);

  const dismiss = () => {
    setShow(false);
    dispose()
  }

  const cancel = (value) => {
    setShow(false)
    reject(value);
  }

  const proceed = (value) => {
    setShow(false)
    resolve(value)
  }

  return (
    <Component
      cancel={cancel}
      dismiss={dismiss}
      proceed={proceed}
      show={show}
      {...other} />
  );
}

export default confirmable;
