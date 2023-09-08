import * as React from 'react';

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import { confirmable, ConfirmDialog, ConfirmDialogProps } from 'react-confirm';

export interface Props {
  okLabel?: string;
  cancelLabel?: string;
  title?: string;
  confirmation?: string;
};

const Confirmation: React.FC<ConfirmDialogProps<Props, boolean>> = (props) => (
  <div className="static-modal">
    <Modal animation={false} show={props.show} onHide={() => props.proceed(false)} backdrop={true}>
      <Modal.Header>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.confirmation}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => props.proceed(false)}>{props.cancelLabel || 'cancel'}</Button>
        <Button className='button-l' onClick={() => props.proceed(true)}>{props.okLabel || 'ok'}</Button>
      </Modal.Footer>
    </Modal>
  </div>
);

export default confirmable(Confirmation);
