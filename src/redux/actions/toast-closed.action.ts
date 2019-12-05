import { ActionTypes } from 'redux/actions/action.enum';
import { BaseAction } from 'redux/actions/base.action';

export interface ToastClosedAction extends BaseAction {
  type: ActionTypes.TOAST_CLOSED;
}

export default ToastClosedAction;
