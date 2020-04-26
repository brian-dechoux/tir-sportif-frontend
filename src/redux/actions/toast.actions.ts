import { ActionTypes } from './action.enum';
import { BaseAction } from './base.action';
import { ToastVariant } from 'components/toast/toast';

export interface OpenToastAction extends BaseAction {
  type: ActionTypes.OPEN_TOAST;
  message: string;
  variant: ToastVariant;
}

export interface CloseToastAction extends BaseAction {
  type: ActionTypes.CLOSE_TOAST;
}

export type ToastActions = OpenToastAction | CloseToastAction;

export function openToast(message: string, variant: ToastVariant): OpenToastAction {
  return {
    type: ActionTypes.OPEN_TOAST,
    message: message,
    variant: variant,
  };
}

export function closeToast(): CloseToastAction {
  return {
    type: ActionTypes.CLOSE_TOAST,
  };
}
