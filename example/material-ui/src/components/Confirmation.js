import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { confirmable } from 'react-confirm';
import Theme from '../theme'

const Confirmation = ({
  okLabel = 'OK',
  cancelLabel = 'Cancel',
  title = 'Confirmation',
  confirmation,
  show,
  proceed,
  dismiss,
  cancel,
  modal,
}) => {
  return (
    <Theme>
      <Dialog
        modal={modal}
        open={show}
        onClose={dismiss}
      >
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>
          {confirmation}
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={cancel}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="contained"
            onClick={proceed}
          >
            {okLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </Theme>
  );
}

export default confirmable(Confirmation);
