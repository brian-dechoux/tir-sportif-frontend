import { combineReducers } from 'redux';
import toast from 'redux/reducers/toast.reducer';
import auth from 'redux/reducers/auth.reducer';
import challenge from 'redux/reducers/challenge.reducer';
import { connectRouter, RouterState } from 'connected-react-router';
import { Reducer } from 'react';
import AuthState from 'redux/states/auth.state.type';
import ChallengeState from 'redux/states/challenge.state.type';
import ToastState from '../states/toast.state.type';

const createRootReducer = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    toast,
    auth,
    challenge,
  });

export type AppState = {
  router: Reducer<RouterState<any>, any>;
  toast: ToastState;
  auth: AuthState;
  challenge: ChallengeState;
};

export default createRootReducer;
