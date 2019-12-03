import { ActionTypes } from 'redux/actions/action.enum';
import { BaseAction } from 'redux/actions/base.action';

export interface LoginAction extends BaseAction {
  type: ActionTypes.LOGIN;
  token: string;
}

export default LoginAction;
