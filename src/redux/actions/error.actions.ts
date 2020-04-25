import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import AppState from 'redux/states/app.state.type';
import { openToast } from './toast.actions';

export function error(message: string): ThunkAction<void, AppState, undefined, any> {
  return (dispatch: ThunkDispatch<AppState, undefined, any>) => {
    dispatch(openToast(message, 'error'));
  };
}
