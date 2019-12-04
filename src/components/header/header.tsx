import { AppBar, Box, Button, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../redux/reducers/combined.reducer';
import AuthContainer from '../auth/auth.container';
import Logo from '../svg/Logo';

type HeaderProps = {
  isConnected: boolean,
  actions: {
    login: (username: string, password: string) => ThunkAction<void, AppState, undefined, any>;
    logout: () => ThunkAction<void, AppState, undefined, any>;
  }
};

const Header = (props: HeaderProps) =>  {
  let authComponent;
  if (!props.isConnected) {
    authComponent = (<AuthContainer />);
  } else {
    authComponent = (<Button
      variant="outlined"
      onClick={() => props.actions.logout()}
    >
      Se déconnecter
    </Button>);
  }

  return (
    <AppBar className="header" position="sticky">
      <Box className="container" component="div" p="20px">
        <Grid container spacing={2} alignItems="center">
          <Grid item md={3}>
            <Logo
              height="100px"
              width="100px"
            />
          </Grid>
          <Grid item md={7}>
            <Typography variant="h3" className="title">
              Tir sportif Briey
            </Typography>
          </Grid>
          <Grid item md={2}>
            {authComponent}
          </Grid>
        </Grid>
      </Box>
    </AppBar>
  );
};

export default Header;
