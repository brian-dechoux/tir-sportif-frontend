import { applyMiddleware, compose, createStore } from 'redux';
import { createBrowserHistory } from 'history';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import reduxLogger from 'redux-logger';
import { CallHistoryMethodAction, routerMiddleware } from 'connected-react-router';
import createRootReducer from 'redux/reducers/combined.reducer';
import AppState from './redux/states/app.state.type';
import { AuthActions } from './redux/actions/auth.actions';
import { GeneralActions } from './redux/actions/general.actions';
import { ToastActions } from './redux/actions/toast.actions';

export const history = createBrowserHistory();

export type Actions = CallHistoryMethodAction | AuthActions | GeneralActions | ToastActions;

const middleware = [
  reduxLogger,
  thunk as ThunkMiddleware<AppState, Actions>,
  routerMiddleware(history),
];

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// TODO Remove initial state, type the first any, add router in AppState, and set auth State with token in App.tsx
export const store = createStore<AppState | undefined, Actions, any, any>(
  createRootReducer(history),
  composeEnhancers(applyMiddleware(...middleware))
);
