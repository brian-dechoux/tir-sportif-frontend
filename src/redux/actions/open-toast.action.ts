import { ActionTypes } from 'redux/actions/action.enum';
import { BaseAction } from 'redux/actions/base.action';
import { ToastVariant } from '../../components/toast/toast-variant.enum';

export interface OpenToastAction extends BaseAction {
  type: ActionTypes.OPEN_TOAST;
  message: string;
  variant: ToastVariant;
}

export default OpenToastAction;
