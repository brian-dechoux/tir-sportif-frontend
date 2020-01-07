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

// Problem with negative path matching: https://github.com/pillarjs/path-to-regexp/issues/99
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>

          <Route render={({ location }) => {
            return location.pathname.indexOf('/login') === -1 ? <HeaderContainer/> : <AuthContainer/>
          }}/>

          <Route path={ROUTES.FRONTEND.RESULTS}>
            <ResultsContainer />
          </Route>

          <Route path={ROUTES.FRONTEND.CHALLENGE}>
            challenge
          </Route>

          <Route path={ROUTES.FRONTEND.CLUBS}>
          </Route>

          <Route path={ROUTES.FRONTEND.MYCLUB}>
          </Route>

          <Redirect exact from="/" to={ROUTES.FRONTEND.RESULTS} />

        </Switch>
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
