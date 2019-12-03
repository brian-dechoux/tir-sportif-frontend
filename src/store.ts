import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reduxLogger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import combinedReducer, { AppState } from 'redux/reducers/combined.reducer';

const initialAppState: AppState = {
  auth: {
    token: localStorage.getItem("token")
  }
};

const middleware = [reduxLogger, thunk];
const store = createStore(combinedReducer, initialAppState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
