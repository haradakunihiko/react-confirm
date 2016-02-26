import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import { confirmable } from 'react-confirm';

class Confirmation extends React.Component {

  render() {
    const {
      okLabel = 'OK',
      cancelLabel = 'Cancel',
      title,
      confirmation,
      show,
      proceed,
      dismiss,
      cancel,
      modal,
    } = this.props;

    const actions = [
      <FlatButton
        label={cancelLabel}
        secondary={true}
        onClick={cancel}
      />,
      <FlatButton
        label={okLabel}
        primary={true}
        onClick={proceed}
      />,
    ];

    return (
      <div>
        <Dialog
          title={title}
          actions={actions}
          modal={modal}
          open={show}
          onRequestClose={dismiss}
        >
          {confirmation}
        </Dialog>
      </div>
    );
  }
}

export default confirmable(Confirmation);
