import React from 'react';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import { store, history } from './store';
import HeaderContainer from './components/header/header.container';
import 'typeface-roboto';
import AuthContainer from './components/login/login.container';
import ResultsContainer from './components/results/results.container';
import { ConnectedRouter } from 'connected-react-router';

function App() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>

          <Route path="/login">
            <AuthContainer />
          </Route>

          <HeaderContainer />

          <Route path="/results">
            <ResultsContainer />
          </Route>

          <Route path="/admin">
          </Route>

          <Redirect exact from="/" to="results" />

        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
