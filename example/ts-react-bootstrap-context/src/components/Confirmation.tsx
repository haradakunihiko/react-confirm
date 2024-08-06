import * as React from 'react';

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import { confirmable, ConfirmDialog } from 'react-confirm';
import { ThemeContext } from '../context/context';

export interface Props {
  okLabel?: string;
  cancelLabel?: string;
  title?: string;
  confirmation?: string;
};

const Confirmation: ConfirmDialog<Props, boolean> = (props) => (
  <ThemeContext.Consumer>
    {
      (theme) => (
        <div className="static-modal">
          <Modal animation={false} show={props.show} onHide={() => props.proceed(false)} backdrop={true}>
            <Modal.Header>
              <Modal.Title>{props.title} ({theme})</Modal.Title>
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
      )
    }
  </ThemeContext.Consumer>
);

export default confirmable(Confirmation);
