import React from 'react';
import { Provider } from 'react-redux';

import './App.css';
import store from './store';
import AuthContainer from './components/auth/auth.container';
import LocalStorageContainer from './components/local-storage/local-storage.container';

function App() {
  return (
    <Provider store={store}>
      <LocalStorageContainer />
      <AuthContainer />
    </Provider>
  );
}

export default App;
