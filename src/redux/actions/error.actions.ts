import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AppState } from '../reducers/combined.reducer';
import { ActionTypes } from './action.enum';
import { BaseAction } from './base.action';

export interface ErrorOccuredAction extends BaseAction {
  type: ActionTypes.ERROR_OCCURED;
  message: string;
}

export function error(message: string): ThunkAction<void, AppState, undefined, any> {
  return (dispatch: ThunkDispatch<AppState, undefined, any>) => {
    dispatch({
      type: ActionTypes.ERROR_OCCURED,
      message: message,
    });
  };
}
