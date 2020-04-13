import { ActionTypes } from 'redux/actions/action.enum';
import { BaseAction } from 'redux/actions/base.action';

export interface CloseToastAction extends BaseAction {
  type: ActionTypes.CLOSE_TOAST;
}

export default CloseToastAction;
