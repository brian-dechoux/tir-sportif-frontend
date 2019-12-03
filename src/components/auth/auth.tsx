import { Button, TextField } from '@material-ui/core';
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

  return (
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
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => props.actions.login(username, password)}
      >
        S'authentifier
      </Button>
    </form>
  );
};

export default Auth;
