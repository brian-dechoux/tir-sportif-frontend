import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import store from './store';
import HeaderContainer from './components/header/header.container';
import 'typeface-roboto';
import AuthContainer from './components/login/login.container';
import ResultsContainer from './components/results/results.container';

function App() {
  return (
    <Provider store={store}>
      <Router>
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
      </Router>
    </Provider>
  );
}

export default App;
