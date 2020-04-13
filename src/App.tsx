import React from 'react';
import { Provider } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import './App.css';
import { history, store } from './store';
import 'typeface-roboto';
import AuthContainer from './components/login/login.container';
import ResultsContainer from './components/results/results.container';
import { ConnectedRouter } from 'connected-react-router';
import { ROUTES } from './configurations/server.configuration';
import HeaderContainer from './components/header/header.container';
import AuthenticatedRedirectContainer from './components/authenticated-route/authenticated.container';
import ChallengeListContainer from './components/challenge/challenge-list/challenge-list.container';
import { Grid, MuiThemeProvider } from '@material-ui/core';
import ChallengeCreationContainer from './components/challenge/challenge-creation/challenge-creation.container';
import { createMuiTheme } from '@material-ui/core/styles';

// Problem with negative path matching: https://github.com/pillarjs/path-to-regexp/issues/99
const App: React.FC = () => {
  const customTheme = createMuiTheme({
    palette: {
      primary: {
        main: '#ffffff',
      },
      secondary: {
        main: '#f2f2f2',
      },
      info: {
        main: '#000000',
      },
    },
  });

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <MuiThemeProvider theme={customTheme}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <HeaderContainer />
            </Grid>
            <Grid item>
              <Route path={ROUTES.LOGIN}>
                <AuthContainer />
              </Route>

              <Route path={ROUTES.RESULTS}>
                <ResultsContainer />
              </Route>

              <Route path={ROUTES.CHALLENGE.LIST}>
                <AuthenticatedRedirectContainer>
                  <ChallengeListContainer />
                </AuthenticatedRedirectContainer>
              </Route>

              <Route path={ROUTES.CHALLENGE.CREATION}>
                <ChallengeCreationContainer />
              </Route>

              <Route path={ROUTES.CLUBS}>
                <AuthenticatedRedirectContainer>clubs</AuthenticatedRedirectContainer>
              </Route>

              <Route path={ROUTES.MYCLUB}>
                <AuthenticatedRedirectContainer>myclub</AuthenticatedRedirectContainer>
              </Route>

              <Redirect exact from="/" to={ROUTES.RESULTS} />
            </Grid>
          </Grid>
        </MuiThemeProvider>
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
