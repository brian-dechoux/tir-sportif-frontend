import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  TextField,
} from '@material-ui/core';
import React, { useState } from 'react';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../redux/reducers/combined.reducer';

type AuthProps = {
  actions: {
    login: (username: string, password: string) => ThunkAction<void, AppState, undefined, any>;
  }
};

const Auth = (props: AuthProps) =>  {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
    <Button variant="outlined" onClick={handleClickOpen}>
      S'authentifier
    </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            Veuillez entrer votre nom d'utilisateur et votre mot de passe:
          </DialogContentText>
          <form noValidate autoComplete="off">
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nom d'utilisateur"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={e => setUsername(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={e => setPassword(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions disableSpacing={true}>
          <Grid container alignItems="center">
            <Grid item md={4}>
              <Button onClick={handleClose} color="secondary">
                Annuler
              </Button>
            </Grid>
            <Grid item md={8}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => props.actions.login(username, password)}
              >
                S'authentifier
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Auth;
