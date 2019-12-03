import { ActionTypes } from 'redux/actions/action.enum';
import { BaseAction } from 'redux/actions/base.action';

export interface LogoutAction extends BaseAction {
  type: ActionTypes.LOGOUT;
}

export default LogoutAction;
