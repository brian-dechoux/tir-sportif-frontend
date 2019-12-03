import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AppState } from '../reducers/combined.reducer';
import LoginAction from './login.action';
import LogoutAction from './logout.action';
import cli from '../../configurations/http-client.configuration';
import { ActionTypes } from './action.enum';
import ROUTES from '../../configurations/server.configuration';

export function login(username: string, password: string): ThunkAction<void, AppState, undefined, any> {
  return (
    dispatch: ThunkDispatch<AppState, undefined, LoginAction>
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
        } else {
          console.log("Wrong credentials");
        }
      }).catch(error => {
        console.log(`An error has occurred during authentication: ${error}`);
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