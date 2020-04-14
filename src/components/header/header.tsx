import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Toolbar,
} from '@material-ui/core';
import React, { useState } from 'react';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../redux/reducers/combined.reducer';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../configurations/server.configuration';
import PersonIcon from '@material-ui/icons/Person';
import LogoIcon from '../svg/logo-icon';
import LogoText from '../svg/logo-text';
import { makeStyles } from '@material-ui/core/styles';
import { customColors } from '../../configurations/theme.configuration';

type HeaderProps = {
  isAuthenticated: boolean;
  actions: {
    login: (username: string, password: string) => ThunkAction<void, AppState, undefined, any>;
    logout: () => ThunkAction<void, AppState, undefined, any>;
  };
};

const Header = (props: HeaderProps) => {
  const useStyles = makeStyles(() => ({
    withFlexGrow: {
      flex: 1,
    },
  }));
  const classes = useStyles();

  let authButtons, menuButtons;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);

  const handleDialogOpen = () => {
    setOpen(true);
  };
  const handleDialogClose = () => {
    setOpen(false);
  };
  const authenticate = () => {
    handleDialogClose();
    props.actions.login(username, password);
  };

  if (props.isAuthenticated) {
    authButtons = (
      <Button onClick={() => props.actions.logout()}>
        Se déconnecter
      </Button>
    );

    menuButtons = (
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
    authButtons = (
      <Button onClick={handleDialogOpen}>
        <PersonIcon />
        Se connecter
      </Button>
    );
  }

  return (
    <>
      <Toolbar>
        <div>
          <LogoIcon height="3rem" width="3rem" />
          <LogoText height="3rem" width="9rem" />
        </div>
        <div className={classes.withFlexGrow}>{menuButtons}</div>
        <div>{authButtons}</div>
      </Toolbar>

      <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle>SE CONNECTER</DialogTitle>
        <DialogContent>
          <DialogContentText>Veuillez entrer vos identifiants de connexion:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Identifiant"
            type="text"
            fullWidth
            onChange={e => setUsername(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Mot de passe"
            type="password"
            fullWidth
            onChange={e => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>ANNULER</Button>
          <Button onClick={authenticate}>CONNEXION</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
