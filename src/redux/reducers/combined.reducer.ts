import { combineReducers } from 'redux';
import auth from 'redux/reducers/auth.reducer';
import { connectRouter, RouterState } from 'connected-react-router';
import { Reducer } from 'react';
import AuthState from '../states/auth.state.type';

const createRootReducer = (history: any) => combineReducers({
  router: connectRouter(history),
  auth
});

export type AppState = {
  router?: Reducer<RouterState<any>, any>,
  auth: AuthState
}

export default createRootReducer;
