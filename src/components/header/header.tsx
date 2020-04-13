import { AppBar, Button, Toolbar } from '@material-ui/core';
import React from 'react';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../redux/reducers/combined.reducer';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../configurations/server.configuration';
import PersonIcon from '@material-ui/icons/Person';
import './header.css';
import LogoIcon from '../svg/logo-icon';
import LogoText from '../svg/logo-text';

type HeaderProps = {
  isAuthenticated: boolean;
  actions: {
    login: (username: string, password: string) => ThunkAction<void, AppState, undefined, any>;
    logout: () => ThunkAction<void, AppState, undefined, any>;
  };
};

const Header = (props: HeaderProps) => {
  let authComponent, menuComponent;
  if (props.isAuthenticated) {
    authComponent = (
      <Button onClick={() => props.actions.logout()}>
        Se déconnecter
      </Button>
    );

    menuComponent = (
      <>
        <Button component={Link} to={ROUTES.CHALLENGE.LIST}>
          CHALLENGES
        </Button>
        <Button component={Link} to={ROUTES.RESULTS}>
          RESULTATS
        </Button>
        <Button component={Link} to={ROUTES.CLUBS}>
          CLUBS
        </Button>
        <Button component={Link} to={ROUTES.MYCLUB}>
          MON CLUB
        </Button>
      </>
    );
  } else {
    authComponent = (
      <Button component={Link} to={ROUTES.LOGIN}>
        <PersonIcon />
        Se connecter
      </Button>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <div>
          <LogoIcon height="3rem" width="3rem" />
          <LogoText height="3rem" width="9rem" />
        </div>
        <div className="flex-grow">{menuComponent}</div>
        <div>{authComponent}</div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
