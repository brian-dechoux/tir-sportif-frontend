import { combineReducers } from 'redux';
import auth from 'redux/reducers/auth.reducer';
import challenge from 'redux/reducers/challenge.reducer';
import { connectRouter, RouterState } from 'connected-react-router';
import { Reducer } from 'react';
import AuthState from '../states/auth.state.type';
import ChallengeState from '../states/challenge.state.type';

const createRootReducer = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    auth,
    challenge,
  });

export type AppState = {
  router?: Reducer<RouterState<any>, any>;
  auth: AuthState;
  challenge: ChallengeState;
};

export default createRootReducer;
