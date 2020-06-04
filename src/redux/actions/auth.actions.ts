import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { ActionTypes } from './action.enum';
import { ERRORS, ROUTES } from 'configurations/server.configuration';
import { push } from 'connected-react-router';
import AuthService from 'services/auth.service';
import { BaseAction } from './base.action';
import { error } from './error.actions';
import AppState from 'redux/states/app.state.type';
import { Actions } from '../../store';

export interface LoginAction extends BaseAction {
  type: ActionTypes.LOGIN;
  token: string;
}

export interface LogoutAction extends BaseAction {
  type: ActionTypes.LOGOUT;
}

export interface ExpireTokenAction extends BaseAction {
  type: ActionTypes.EXPIRE_TOKEN;
}

export type AuthActions = LoginAction | LogoutAction | ExpireTokenAction;

export function login(
  username: string,
  password: string
): ThunkAction<void, AppState, undefined, Actions> {
  return (dispatch: ThunkDispatch<AppState, undefined, Actions>) => {
    AuthService.login(username, password)
      .then(response => {
        if (response.status === 200) {
          localStorage.setItem('token', response.data.jwtToken);
          dispatch({
            type: ActionTypes.LOGIN,
            token: response.data.jwtToken,
          });
          dispatch(push(ROUTES.RESULTS));
        }
      })
      .catch(errorResponse => {
        if (errorResponse.response.status === 401) {
          if (errorResponse.response.data.code === ERRORS.EXPIRED_TOKEN) {
            dispatch(expireToken());
          }
        } else {
          dispatch(error(errorResponse.response.data.message));
        }
      });
  };
}

export function logout(): ThunkAction<void, AppState, undefined, Actions> {
  return (dispatch: ThunkDispatch<AppState, undefined, Actions>) => {
    AuthService.logout()
      .then(() => {
        dispatch({
          type: ActionTypes.LOGOUT,
        });
      })
      .catch(() => {
        dispatch({
          type: ActionTypes.LOGOUT,
        });
      });
  };
}

export function loadTokenIfAvailable(): ThunkAction<void, AppState, undefined, Actions> {
  return (dispatch: ThunkDispatch<AppState, undefined, Actions>) => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      dispatch({
        type: ActionTypes.LOGIN,
        token: savedToken,
      });
    }
  };
}

export function expireToken(): ThunkAction<void, AppState, undefined, Actions> {
  return (dispatch: ThunkDispatch<AppState, undefined, Actions>) => {
    dispatch(error('Session expirée, veuillez vous connecter à nouveau'));
    dispatch(push(ROUTES.RESULTS));
    localStorage.removeItem('token');
    dispatch({
      type: ActionTypes.EXPIRE_TOKEN,
    });
  };
}
