import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { SnackbarContent } from '@material-ui/core';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

export type ToastVariant = keyof typeof variantIcon;

const useStylesContent = makeStyles((theme: Theme) => ({
  success: {
    backgroundColor: theme.palette.success.dark,
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

type ToastProps = {
  isShown: boolean;
  message: string;
  variant: ToastVariant;
  onCloseCallback: () => void;
};

interface SnackBarContentProps {
  className?: string;
  message?: string;
  onClose?: () => void;
  variant: keyof typeof variantIcon;
}

function SnackbarContentWrapper(props: SnackBarContentProps) {
  const classes = useStylesContent();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

const useStylesToast = makeStyles((theme: Theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

const Toast = (props: ToastProps) => {
  const classes = useStylesToast();

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={props.isShown}
      autoHideDuration={3000}
      onClose={props.onCloseCallback}
    >
      <SnackbarContentWrapper
        variant={props.variant}
        className={classes.margin}
        message={props.message}
        onClose={props.onCloseCallback}
      />
    </Snackbar>
  );
};

export default Toast;
