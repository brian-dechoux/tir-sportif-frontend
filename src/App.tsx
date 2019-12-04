import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import store from './store';
import HeaderContainer from './components/header/header.container';
import 'typeface-roboto';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <HeaderContainer />
        <Switch>
          <Route path="/results">
          </Route>
          <Redirect exact from="/" to="results" />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
