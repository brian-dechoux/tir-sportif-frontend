import { ActionTypes } from 'redux/actions/action.enum';
import { BaseAction } from 'redux/actions/base.action';

export interface ErrorOccuredAction extends BaseAction {
  type: ActionTypes.ERROR_OCCURED;
  message: string;
}

export default ErrorOccuredAction;
