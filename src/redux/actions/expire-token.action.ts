import { ActionTypes } from 'redux/actions/action.enum';
import { BaseAction } from 'redux/actions/base.action';

export interface ExpireTokenAction extends BaseAction {
  type: ActionTypes.EXPIRE_TOKEN;
  message: string;
}

export default ExpireTokenAction;
