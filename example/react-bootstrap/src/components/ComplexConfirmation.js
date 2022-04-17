import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import Modal from 'react-bootstrap/Modal'
import { confirmable } from 'react-confirm';

const ComplexConfirmation = ({
  show,
  proceed,
  dismiss,
  cancel,
  message
}) => {
  const inputRef = useRef();

  const handleOnClick = (index) => {
    return () => {
      proceed({
        button: index,
        input: inputRef.current.value,
      });
    }
  }

  return (
    <div className="static-modal">
      <Modal animation={false} show={show} onHide={dismiss}>
        <Modal.Header>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message}
        </Modal.Body>
        <Modal.Footer>
          <FormControl type="text" ref={inputRef} type='text' />
          <Button onClick={cancel}>Cancel</Button>
          <Button className='button-l' bsStyle="default" onClick={handleOnClick(1)}>1st</Button>
          <Button className='button-l' bsStyle="default" onClick={handleOnClick(2)}>2nd</Button>
          <Button className='button-l' bsStyle="default" onClick={handleOnClick(3)}>3rd</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}


export default confirmable(ComplexConfirmation);
