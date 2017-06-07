import React, { PropTypes } from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { confirmable } from 'react-confirm';

class ComplexConfirmation extends React.Component {

  refCallback(ref) {
    this.inputRef = ref;
  }

  handleOnClick(index) {
    const { proceed } = this.props;
    return () => {
      proceed({
        button: index,
        input: this.inputRef.value,
      });
    }
  }

  render() {
    const {
      show,
      proceed,
      dismiss,
      cancel,
      message
    } = this.props;

    return (
      <div className="static-modal">
        <Modal isOpen={show} toggle={dismiss} >
          <ModalBody>
            {message}
          </ModalBody>
          <ModalFooter>
            <input ref={::this.refCallback} type='text' />
            <Button onClick={cancel}>Cancel</Button>
            <Button className='button-l' color="default" onClick={this.handleOnClick(1)}>1st</Button>
            <Button className='button-l' color="default" onClick={this.handleOnClick(2)}>2nd</Button>
            <Button className='button-l' color="default" onClick={this.handleOnClick(3)}>3rd</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}


export default confirmable(ComplexConfirmation);
