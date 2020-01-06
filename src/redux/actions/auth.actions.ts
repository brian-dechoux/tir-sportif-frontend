import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AppState } from '../reducers/combined.reducer';
import cli from '../../configurations/http-client.configuration';
import { ActionTypes } from './action.enum';
import { ROUTES, ERRORS } from '../../configurations/server.configuration';
import ToastClosedAction from './toast-closed.action';
import { push } from 'connected-react-router';

export function login(username: string, password: string): ThunkAction<void, AppState, undefined, any> {
  return (
    dispatch: ThunkDispatch<AppState, undefined, any>
  ) => {
    const authPayload = {
      username: username,
      password: password
    };

    cli.post(ROUTES.BACKEND.AUTHENTICATION.LOGIN, authPayload)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: ActionTypes.LOGIN,
            token: response.data.jwtToken
          });
          dispatch(push(ROUTES.FRONTEND.DASHBOARD));
        }
      }).catch(error => {
        console.log(error);
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
    const config = {
      headers: {'Authorization': "bearer " + getState().auth.token}
    };
    cli.post(ROUTES.BACKEND.AUTHENTICATION.LOGOUT, {}, config).then(() => {
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
