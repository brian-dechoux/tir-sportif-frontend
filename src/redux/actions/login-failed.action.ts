import { ActionTypes } from 'redux/actions/action.enum';
import { BaseAction } from 'redux/actions/base.action';

export interface LoginFailedAction extends BaseAction {
  type: ActionTypes.LOGIN_FAILED;
  message: string;
}

export default LoginFailedAction;
