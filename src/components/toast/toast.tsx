import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

// TODO wth ?
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    close: {
      padding: theme.spacing(0.5),
    },
  })
);

type ToastProps = {
  isShown: boolean;
  message: string;
  onCloseCallback: () => void;
};

const Toast = (props: ToastProps) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    props.onCloseCallback();
  };

  if (props.isShown) {
    return (
      <>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message={<span id="message-id">{props.message}</span>}
          action={[
            <IconButton
              key="close"
              color="inherit"
              className={classes.close}
              onClick={handleClose}
            >
              <CloseIcon/>
            </IconButton>,
          ]}
        />
      </>
    );
  } else {
    return null;
  }
};

export default Toast;
