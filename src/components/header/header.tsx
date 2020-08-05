import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from 'configurations/server.configuration';
import PersonIcon from '@material-ui/icons/Person';
import LogoIcon from 'components/svg/logo-icon';
import LogoText from 'components/svg/logo-text';
import { makeStyles } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Desktop from '../media/desktop';

type HeaderProps = {
  isAuthenticated: boolean;
  actions: {
    login: (username: string, password: string) => any;
    logout: () => any;
  };
};

const Header = (props: HeaderProps) => {
  const useStyles = makeStyles(() => ({
    withFlexGrow: {
      flex: 1,
    },
    withPaddingTop: {
      paddingTop: '0.3em',
    },
    customizeToolbar: {
      margin: 0,
      minHeight: 36,
    },
  }));
  const classes = useStyles();

  let authButtons, menu;
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
      <Desktop>
        <Button
          onClick={() => props.actions.logout()}
          startIcon={<ExitToAppIcon />}
        >
          SE DÉCONNECTER
        </Button>
      </Desktop>
    );

    menu = (
      <Desktop>
        <Button component={Link} to={ROUTES.CHALLENGE.LIST}>
          CHALLENGES
        </Button>
        <Button component={Link} to={ROUTES.RESULTS.LIST}>
          RÉSULTATS
        </Button>
      </Desktop>
    );
  } else {
    menu = (
      <Desktop>
        <Typography variant='h6'>PLATEFORME DE CONSULTATION DE RÉSULTATS DE TIR</Typography>
      </Desktop>
    );
    authButtons = (
      <Desktop>
        <Button
          onClick={handleDialogOpen}
          startIcon={<PersonIcon />}
        >
          SE CONNECTER
        </Button>
      </Desktop>
    );
  }

  return (
    <>
      <Toolbar className={classes.customizeToolbar}>
        <div className={classes.withPaddingTop}>
          <LogoIcon height="3rem" width="3rem" />
          <LogoText height="3rem" width="9rem" />
        </div>
        <div className={classes.withFlexGrow}>{menu}</div>
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
