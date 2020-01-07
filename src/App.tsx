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

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>

          <Route path={ROUTES.FRONTEND.LOGIN}>
            <AuthContainer />
          </Route>

          <Route path={ROUTES.FRONTEND.RESULTS}>
            <ResultsContainer />
          </Route>

          <Route path={ROUTES.FRONTEND.CHALLENGE}>
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
