import { ActionTypes } from 'redux/actions/action.enum';
import { LoginAction } from 'redux/actions/login.action';
import { LogoutAction } from 'redux/actions/logout.action';
import AuthState from 'redux/states/auth.state.type';
import ExpireTokenAction from '../actions/expire-token.action';

const initialState: AuthState = {
  token: null,
};

type AuthActions = LoginAction | LogoutAction | ExpireTokenAction;

export default function(state: AuthState = initialState, action: AuthActions) {
  switch (action.type) {
    case ActionTypes.LOGIN:
      return Object.assign({}, state, {
        ...state,
        token: action.token,
      });

    case ActionTypes.LOGOUT:
      return Object.assign({}, state, {
        ...state,
        token: null,
      });

    case ActionTypes.EXPIRE_TOKEN:
      return Object.assign({}, state, {
        ...state,
        token: null,
      });

    default:
      return state;
  }
}
