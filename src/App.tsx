import React from 'react';
import { Provider } from 'react-redux';

import logo from 'assets/logo.svg';
import './App.css';
import store from './store';
import AuthContainer from './components/auth/auth.container';

function App() {
  return (
    <Provider store={store}>
      <AuthContainer />
    </Provider>
  );
}

export default App;
