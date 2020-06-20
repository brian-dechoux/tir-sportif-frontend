import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import ErrorIcon from '@material-ui/icons/Error';

enum DialogType {
  INFO, WARNING
}

interface DialogTypeSpec {
  icon: JSX.Element,
  validateButtonText: string
}

function getDialogTypeSpec(dialogType: DialogType): DialogTypeSpec {
  switch (dialogType) {
    case DialogType.INFO:
      return {
        icon: <InfoIcon color="secondary" />,
        validateButtonText: 'OK'
      };
    case DialogType.WARNING:
      return {
        icon: <ErrorIcon color="secondary"/>,
        validateButtonText: 'CONFIRMER'
      };
  }
}

type ActionValidationDialogProps = {
  dialogType: DialogType
  dialogTitle: string
  dialogContentMessage: string
  callbackValidateFn: () => any
  callbackCloseFn: () => any
};

// TODO Use this for validation actions
const ActionValidationDialog = (props: ActionValidationDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(true);

  const handleClose = () => {
    setDialogOpen(false);
    props.callbackCloseFn();
  };

  const handleValidation = () => {
    setDialogOpen(false);
    props.callbackValidateFn();
  }

  const cancelButton = props.dialogType === DialogType.WARNING ?
    <Button variant="outlined" onClick={handleClose}>
      ANNULER
    </Button> : null;

  return (
    <Dialog fullWidth maxWidth="md" open={dialogOpen} onClose={handleClose}>
      <DialogTitle>{props.dialogTitle}</DialogTitle>
      <DialogContent>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={2}>
            {getDialogTypeSpec(props.dialogType).icon}
          </Grid>
          <Grid item xs={10}>
            {props.dialogContentMessage}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {cancelButton}
        <Button
          onClick={handleValidation}
          variant="contained"
          color="secondary"
        >
          {getDialogTypeSpec(props.dialogType).validateButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionValidationDialog;
