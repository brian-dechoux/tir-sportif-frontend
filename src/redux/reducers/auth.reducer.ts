import { ActionTypes } from 'redux/actions/action.enum';
import { LoginAction } from 'redux/actions/login.action';
import { LogoutAction } from 'redux/actions/logout.action';
import AuthState from 'redux/states/auth.state.type';

const initialState: AuthState = {
  token: null
};

type AuthActions = LoginAction | LogoutAction;

export default function(state: AuthState = initialState, action: AuthActions) {
  switch (action.type) {

    case ActionTypes.LOGIN:
      console.log(`token: ${action.token}`);
      return Object.assign({}, state, {
        ...state,
        token: action.token
      });

    case ActionTypes.LOGOUT:
      return Object.assign({}, state, {
        ...state,
        token: null
      });

    default:
      return state;
  }
}
