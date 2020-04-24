import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers/combined.reducer';
import { ActionTypes } from './action.enum';
import { ERRORS, ROUTES } from 'configurations/server.configuration';
import { push } from 'connected-react-router';
import AuthService from 'services/auth.service';
import { BaseAction } from './base.action';
import { openToast } from './toast.actions';

export interface LoginAction extends BaseAction {
  type: ActionTypes.LOGIN;
  token: string;
}

export interface LogoutAction extends BaseAction {
  type: ActionTypes.LOGOUT;
}

export interface ExpireTokenAction extends BaseAction {
  type: ActionTypes.EXPIRE_TOKEN;
  message: string;
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
      .catch(error => {
        if (error.response.status === 401) {
          if (error.response.data.code === ERRORS.EXPIRED_TOKEN) {
            dispatch({
              type: ActionTypes.EXPIRE_TOKEN,
              message: 'Session expirée, veuillez vous re-authentifier',
            });
          } else {
            dispatch(
              openToast(
                'Les informations remplies ne correspondent pas à un utilisateur connu',
                'error'
              )
            );
          }
        } else {
          dispatch(
            openToast(
              "Une erreur s'est produite durant l'authentification",
              'error'
            )
          );
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
