import * as React from 'react';

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import { confirmable, ConfirmDialog } from 'react-confirm';

export interface Props {
  okLabel?: string;
  cancelLabel?: string;
  title?: string;
  confirmation?: string;
};

const Confirmation: ConfirmDialog<Props, boolean> = ({show, proceed, title, confirmation, okLabel, cancelLabel}) => (
  <div className="static-modal">
    <Modal animation={false} show={show} onHide={() => proceed(false)} backdrop={true}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {confirmation}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => proceed(false)}>{cancelLabel || 'cancel'}</Button>
        <Button className='button-l' onClick={() => proceed(true)}>{okLabel || 'ok'}</Button>
      </Modal.Footer>
    </Modal>
  </div>
);

export default confirmable(Confirmation);
