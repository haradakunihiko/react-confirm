import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { confirmable } from 'react-confirm';

import Theme from '../theme'

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
      <Theme>
        <Dialog
          title={title}
          actions={actions}
          modal={modal}
          open={show}
          onRequestClose={dismiss}
        >
          {confirmation}
        </Dialog>
      </Theme>
    );
  }
}

export default confirmable(Confirmation);
