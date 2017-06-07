import React, { PropTypes } from 'react';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { confirmable } from 'react-confirm';

class Confirmation extends React.Component {
  render() {
    const {
      okLabbel = 'OK',
      cancelLabel = 'Cancel',
      title,
      confirmation,
      show,
      proceed,
      dismiss,
      cancel,
      enableEscape = true,
    } = this.props;
    return (
        <Modal isOpen={show} toggle={dismiss} backdrop={enableEscape ? true : 'static'} keyboard={enableEscape}>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            {confirmation}
          </ModalBody>
          <ModalFooter>
            <Button onClick={cancel}>{cancelLabel}</Button>
            <Button className='button-l' color="primary" onClick={proceed}>{okLabbel}</Button>
          </ModalFooter>
        </Modal>
    )
  }
}

Confirmation.propTypes = {
  okLabbel: PropTypes.string,
  cancelLabel: PropTypes.string,
  title: PropTypes.string,
  confirmation: PropTypes.string,
  show: PropTypes.bool,
  proceed: PropTypes.func,     // called when ok button is clicked.
  cancel: PropTypes.func,      // called when cancel button is clicked.
  dismiss: PropTypes.func,     // called when backdrop is clicked or escaped.
  enableEscape: PropTypes.bool,
}

export default confirmable(Confirmation);
