import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
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
      enableEscape = true,
    } = this.props;
    return (
      <div className="static-modal">
        <Modal show={show} onHide={() => proceed(false)} backdrop={enableEscape ? true : 'static'} keyboard={enableEscape}>
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {confirmation}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() =>proceed(false)}>{cancelLabel}</Button>
            <Button className='button-l' bsStyle="primary" onClick={() => proceed(true)}>{okLabbel}</Button>
          </Modal.Footer>
        </Modal>
      </div>
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
  enableEscape: PropTypes.bool,
}

export default confirmable(Confirmation);
