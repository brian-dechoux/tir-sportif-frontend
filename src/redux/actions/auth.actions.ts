import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AppState } from '../reducers/combined.reducer';
import LogoutAction from './logout.action';
import cli from '../../configurations/http-client.configuration';
import { ActionTypes } from './action.enum';
import ROUTES from '../../configurations/server.configuration';
import ToastClosedAction from './toast-closed.action';

export function login(username: string, password: string): ThunkAction<void, AppState, undefined, any> {
  return (
    dispatch: ThunkDispatch<AppState, undefined, any>
  ) => {
    const authPayload = {
      username: username,
      password: password
    };

    cli.post(ROUTES.AUTHENTICATION.LOGIN, authPayload)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: ActionTypes.LOGIN,
            token: response.data.jwtToken
          });
        }
      }).catch(error => {
        if (error.response.status === 401) {
          console.log("Wrong credentials");
          dispatch({
            type: ActionTypes.LOGIN_FAILED,
            message: "Les informations remplies ne correspondent pas à un utilisateur connu"
          });
        } else {
          console.log(`An error has occurred during authentication: ${error}`);
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
    dispatch: ThunkDispatch<AppState, undefined, LogoutAction>,
    getState: () => AppState
  ) => {
    const config = {
      headers: {'Authorization': "bearer " + getState().auth.token}
    };
    cli.post(ROUTES.AUTHENTICATION.LOGOUT, {}, config).then(response => {
      if (response.status === 200) {
        dispatch({
          type: ActionTypes.LOGOUT
        });
      } else {
        // TODO toast error
      }
    }).catch(error => {
      // TODO toast error oopsie
    });
  };
}

// FIXME should this be in some generic-action component ?
export function closeToast(): ToastClosedAction {
  return {
    type: ActionTypes.TOAST_CLOSED
  };
}
