import { ActionTypes } from 'redux/actions/action.enum';
import { LoginAction } from 'redux/actions/login.action';
import { LogoutAction } from 'redux/actions/logout.action';
import AuthState from 'redux/states/auth.state.type';
import LoginFailedAction from '../actions/login-failed.action';
import ToastClosedAction from '../actions/toast-closed.action';

const initialState: AuthState = {
  token: null,
  showLoginToast: false,
  loginToastMessage: null
};

type AuthActions = LoginAction | LogoutAction | LoginFailedAction | ToastClosedAction;

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

    case ActionTypes.LOGIN_FAILED:
      return Object.assign({}, state, {
        ...state,
        showLoginToast: true,
        loginToastMessage: action.message
      });

    case ActionTypes.TOAST_CLOSED:
      return Object.assign({}, state, {
        ...state,
        showLoginToast: false,
        loginToastMessage: null
      });

    default:
      return state;
  }
}
