import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import './App.css';
import { history, store } from './store';
import 'typeface-roboto';
import ResultsContainer from './components/results/results.container';
import { ConnectedRouter } from 'connected-react-router';
import { ROUTES } from './configurations/server.configuration';
import HeaderContainer from './components/header/header.container';
import AuthenticatedRedirectContainer from './components/authenticated-route/authenticated.container';
import { Box, Container, Grid, MuiThemeProvider } from '@material-ui/core';
import ChallengeCreationContainer from './components/challenge/challenge-creation/challenge-creation.container';
import { makeStyles } from '@material-ui/core/styles';
import ToastContainer from './components/toast/toast.container';
import { customTheme } from './configurations/theme.configuration';
import ChallengeListContainer from './components/challenge/challenge-list/challenge-list.container';
import { loadTokenIfAvailable } from './redux/actions/auth.actions';
import ChallengeDetailContainer from './components/challenge/challenge-detail/challenge-detail.container';

// TODO https://react-redux.js.org/api/hooks ? to use react redux with functional component only and remove the container HOCs
const App = () => {
  const useStyles = makeStyles(() => ({
    main: {
      background: customTheme.mainBackground,
    },
    container: {
      background: customTheme.containerBackground,
    },
  }));
  const classes = useStyles();

  useEffect(() => {
    store.dispatch(loadTokenIfAvailable());
  }, []);

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <MuiThemeProvider theme={customTheme.mui}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <HeaderContainer />
              <ToastContainer />
            </Grid>
            <Grid item className={classes.main}>
              <Container className={classes.container}>
                <Box pt={2} pb={2} width={1}>
                  <Route exact path={ROUTES.RESULTS}>
                    <ResultsContainer />
                  </Route>

                  <Route exact path={ROUTES.CHALLENGE.LIST}>
                    <AuthenticatedRedirectContainer>
                      <ChallengeListContainer />
                    </AuthenticatedRedirectContainer>
                  </Route>

                  <Route exact path={ROUTES.CHALLENGE.CREATION}>
                    <ChallengeCreationContainer />
                  </Route>

                  <Route exact path={`${ROUTES.CHALLENGE.LIST}/:challengeId`}>
                    <ChallengeDetailContainer />
                  </Route>

                  <Route exact path={ROUTES.CLUBS}>
                    <AuthenticatedRedirectContainer>clubs</AuthenticatedRedirectContainer>
                  </Route>

                  <Route exact path={ROUTES.MYCLUB}>
                    <AuthenticatedRedirectContainer>myclub</AuthenticatedRedirectContainer>
                  </Route>

                  <Redirect exact from="/" to={ROUTES.CHALLENGE.LIST} />
                </Box>
              </Container>
            </Grid>
          </Grid>
        </MuiThemeProvider>
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
