import { AppBar, Box, Button, Grid, IconButton, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../redux/reducers/combined.reducer';
import Logo from '../svg/Logo';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../configurations/server.configuration';
import MenuIcon from '@material-ui/icons/Menu';

type HeaderProps = {
  isAuthenticated: boolean,
  actions: {
    login: (username: string, password: string) => ThunkAction<void, AppState, undefined, any>;
    logout: () => ThunkAction<void, AppState, undefined, any>;
  }
};

const Header = (props: HeaderProps) =>  {
  let authComponent;
  if (!props.isAuthenticated) {
    authComponent = (
      <Button
        variant="outlined"
        component={Link} to={ROUTES.LOGIN}
      >
        Se connecter
      </Button>
    );
  } else {
    authComponent = (
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => props.actions.logout()}
      >
        Se déconnecter
      </Button>
    );
  }

  return (
    <AppBar className="header" position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit">
          <MenuIcon />
        </IconButton>
        <Logo
          height="50px"
          width="50px"
        />
        <Typography variant="h6">
          TIR SPORTIF BRIEY
        </Typography>
        {authComponent}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
