import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AppState } from '../reducers/combined.reducer';
import { ActionTypes } from './action.enum';
import { ROUTES, ERRORS } from '../../configurations/server.configuration';
import ToastClosedAction from './toast-closed.action';
import { push } from 'connected-react-router';
import AuthService from '../../services/auth.service';

export function login(username: string, password: string): ThunkAction<void, AppState, undefined, any> {
  return (
    dispatch: ThunkDispatch<AppState, undefined, any>
  ) => {

    AuthService.login(username, password)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: ActionTypes.LOGIN,
            token: response.data.jwtToken
          });
          dispatch(push(ROUTES.RESULTS));
        }
      }).catch(error => {
        if (error.response.status === 401) {
          if (error.response.data.code === ERRORS.EXPIRED_TOKEN) {
            dispatch({
              type: ActionTypes.EXPIRE_TOKEN,
              message: "Session expirée, veuillez vous re-authentifier"
            });
          } else {
            dispatch({
              type: ActionTypes.LOGIN_FAILED,
              message: "Les informations remplies ne correspondent pas à un utilisateur connu"
            });
          }
        } else {
          dispatch({
            type: ActionTypes.LOGIN_FAILED,
            message: "Une erreur s'est produite durant l'authentification"
          });
        }
      });
  };
}

export function logout(): ThunkAction<void, AppState, undefined, any> {
  return (
    dispatch: ThunkDispatch<AppState, undefined, any>,
    getState: () => AppState
  ) => {
    AuthService.logout()
      .then(() => {
      dispatch({
        type: ActionTypes.LOGOUT
      });
    }).catch(() => {
      dispatch({
        type: ActionTypes.LOGOUT
      });
    });
  };
}

// FIXME should this be in some generic-action component ?
export function closeToast(): ToastClosedAction {
  return {
    type: ActionTypes.TOAST_CLOSED
  };
}
