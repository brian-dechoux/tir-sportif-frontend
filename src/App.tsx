import React from 'react';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import { store, history } from './store';
import 'typeface-roboto';
import AuthContainer from './components/login/login.container';
import ResultsContainer from './components/results/results.container';
import { ConnectedRouter } from 'connected-react-router';
import { ROUTES } from './configurations/server.configuration';
import HeaderContainer from './components/header/header.container';
import MenuContainer from './components/menu/menu.container';
import AuthenticatedRedirectContainer from './components/authenticated-route/authenticated.container';
import ChallengeContainer from './components/challenge/challenge.container';
import { Box, Grid } from '@material-ui/core';

// Problem with negative path matching: https://github.com/pillarjs/path-to-regexp/issues/99
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>

          <Route path={ROUTES.FRONTEND.LOGIN}>
            <AuthContainer />
          </Route>

          <Route path={ROUTES.FRONTEND.RESULTS}>
            <HeaderContainer/>
            <ResultsContainer/>
          </Route>


          <Route path={ROUTES.FRONTEND.CHALLENGE}>
            <Box>
              <Grid container direction="row" spacing={2}>
                <Grid item md={12}>
                  <HeaderContainer/>
                </Grid>
                <Grid item md={12}>
                  <AuthenticatedRedirectContainer>
                    <ChallengeContainer/>
                  </AuthenticatedRedirectContainer>
                </Grid>
              </Grid>
            </Box>
          </Route>


          <Route path={ROUTES.FRONTEND.CLUBS}>
            <HeaderContainer/>
            <AuthenticatedRedirectContainer>
              clubs
            </AuthenticatedRedirectContainer>
          </Route>

          <Route path={ROUTES.FRONTEND.MYCLUB}>
            <HeaderContainer/>
            <AuthenticatedRedirectContainer>
              myclub
            </AuthenticatedRedirectContainer>
          </Route>

          <Redirect exact from="/" to={ROUTES.FRONTEND.RESULTS} />

        </Switch>
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
