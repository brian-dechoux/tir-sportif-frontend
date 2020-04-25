import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { ActionTypes } from './action.enum';
import { ERRORS, ROUTES } from 'configurations/server.configuration';
import { push } from 'connected-react-router';
import AuthService from 'services/auth.service';
import { BaseAction } from './base.action';
import { error } from './error.actions';
import AppState from 'redux/states/app.state.type';

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

export function login(
  username: string,
  password: string
): ThunkAction<void, AppState, undefined, any> {
  return (dispatch: ThunkDispatch<AppState, undefined, any>) => {
    AuthService.login(username, password)
      .then(response => {
        if (response.status === 200) {
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
          } else {
            dispatch(
              error('Les informations remplies ne correspondent pas à un utilisateur connu')
            );
          }
        } else {
          dispatch(error("Une erreur s'est produite durant l'authentification"));
        }
      });
  };
}

export function logout(): ThunkAction<void, AppState, undefined, any> {
  return (dispatch: ThunkDispatch<AppState, undefined, any>) => {
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

export function expireToken(): ExpireTokenAction {
  error('Session expirée, veuillez vous connecter à nouveau');
  push(ROUTES.RESULTS);
  return {
    type: ActionTypes.EXPIRE_TOKEN,
  };
}
