import { combineReducers } from 'redux';
import toast from 'redux/reducers/toast.reducer';
import auth from 'redux/reducers/auth.reducer';
import { connectRouter, RouterState } from 'connected-react-router';
import { Reducer } from 'react';
import AuthState from 'redux/states/auth.state.type';
import ToastState from 'redux/states/toast.state.type';

const createRootReducer = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    toast,
    auth,
  });

export type AppState = {
  router: Reducer<RouterState<any>, any>;
  toast: ToastState;
  auth: AuthState;
};

export default createRootReducer;
