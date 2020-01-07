import {
  Box,
  Button,
  Grid,
  TextField, Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../redux/reducers/combined.reducer';
import './login.css'
import Toast from '../toast/toast';
import ToastClosedAction from '../../redux/actions/toast-closed.action';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../configurations/server.configuration';

type LoginProps = {
  loginFailedToast: {
    isShown: boolean,
    message: string
  }
  actions: {
    login: (username: string, password: string) => ThunkAction<void, AppState, undefined, any>;
    closeToast: () => ToastClosedAction;
  }
};

const Login = (props: LoginProps) =>  {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  let toast;
  if (props.loginFailedToast.isShown) {
    toast = <Toast
      message={(props.loginFailedToast.message)}
      onCloseCallback={() => props.actions.closeToast()}
    />
  }

  return (
    <Box>
      {toast}
      <Grid container justify="center" spacing={2}>
        <Grid item md={9}>
        </Grid>
        <Grid container item md={3} className="login-sheet" alignItems="center">
          <form noValidate autoComplete="off">
            <Grid container item justify="center" direction="row">
              <Grid item md={10}>
                <Typography variant="h6" className="title">
                  Veuillez entrer vos identifiants:
                </Typography>
              </Grid>
              <Grid item md={10}>
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
                <Grid item md={10}>
                </Grid>
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
              </Grid>
            </Grid>

            <Grid container item justify="center">
              <Grid item md={5}>
                <Button
                  variant="outlined"
                  color="secondary"
                  component={Link} to={ROUTES.FRONTEND.DASHBOARD}
                >
                  Annuler
                </Button>
              </Grid>
              <Grid item md={5}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => props.actions.login(username, password)}
                >
                  S'authentifier
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
