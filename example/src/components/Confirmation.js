import React from 'react';

import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import { confirmable } from 'react-confirm';

class Confirmation extends React.Component {
  render() {
    const { okButton = 'OK', cancelButton = 'キャンセル', confirmation, title, enableEscape = true, show, dismiss, proceed } = this.props;
    return (
      <div className="static-modal">
        <Modal show={show} onHide={dismiss} backdrop={enableEscape ? true : 'static'} keyboard={enableEscape}>
          {title && (
            <Modal.Header>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
          )}
          <Modal.Body>
            {confirmation}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={dismiss}>{cancelButton}</Button>
            <Button className='button-l' bsStyle="primary" onClick={proceed}>{okButton}</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default confirmable(Confirmation);
