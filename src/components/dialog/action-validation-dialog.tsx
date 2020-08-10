import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import ErrorIcon from '@material-ui/icons/Error';

export enum DialogType {
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
  callbackCloseFn?: () => any | undefined
};

const ActionValidationDialog = (props: ActionValidationDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(true);

  const handleClose = () => {
    setDialogOpen(false);
    if (props.callbackCloseFn) {
      props.callbackCloseFn();
    }
  };

  const handleValidation = () => {
    setDialogOpen(false);
    props.callbackValidateFn();
  }

  const cancelButton = props.dialogType === DialogType.WARNING ?
    <Button
      variant="text"
      size="small"
      onClick={handleClose}
    >
      ANNULER
    </Button> : null;

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="md"
      open={dialogOpen}
      onClose={handleClose}
    >
      <DialogTitle>
        <Typography variant="h6">{getDialogTypeSpec(props.dialogType).icon} {props.dialogTitle}</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">{props.dialogContentMessage}</Typography>
      </DialogContent>
      <DialogActions>
        {cancelButton}
        <Button
          variant="text"
          color="secondary"
          size="small"
          onClick={handleValidation}
        >
          {getDialogTypeSpec(props.dialogType).validateButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionValidationDialog;
