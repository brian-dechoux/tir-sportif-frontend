import { createStore, applyMiddleware, compose } from 'redux';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import reduxLogger from 'redux-logger';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from 'redux/reducers/combined.reducer';

export const history = createBrowserHistory();

// FIXME why should I provide a whole goddamn state here
const initialAppState: any = {
  toast: {
    isShown: false,
    message: '',
    variant: 'success',
  },
  auth: {
    token: localStorage.getItem('token'),
  },
  challenge: {
    pagedChallenges: null,
  },
};

const middleware = [reduxLogger, thunk, routerMiddleware(history)];

export const store = createStore(
  createRootReducer(history),
  initialAppState,
  compose(applyMiddleware(...middleware))
);
