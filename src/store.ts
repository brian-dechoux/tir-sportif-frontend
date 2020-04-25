import { applyMiddleware, compose, createStore } from 'redux';
import { createBrowserHistory } from 'history';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import reduxLogger from 'redux-logger';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from 'redux/reducers/combined.reducer';
import { BaseAction } from './redux/actions/base.action';
import AppState from './redux/states/app.state.type';

export const history = createBrowserHistory();

const initialAppState: AppState = {
  general: {
    countries: [],
  },
  toast: {
    isShown: false,
    message: '',
    variant: 'success',
  },
  auth: {
    token: localStorage.getItem('token'),
  },
};

const middleware = [
  reduxLogger,
  thunk as ThunkMiddleware<AppState, BaseAction>,
  routerMiddleware(history),
];

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  createRootReducer(history),
  initialAppState,
  composeEnhancers(applyMiddleware(...middleware))
);
