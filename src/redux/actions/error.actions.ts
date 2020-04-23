import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AppState } from '../reducers/combined.reducer';
import { ActionTypes } from './action.enum';

export function error(message: string): ThunkAction<void, AppState, undefined, any> {
  return (dispatch: ThunkDispatch<AppState, undefined, any>) => {
    dispatch({
      type: ActionTypes.ERROR_OCCURED,
      message: message,
    });
  };
}
