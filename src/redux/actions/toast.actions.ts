import { ActionTypes } from './action.enum';
import CloseToastAction from './close-toast.action';

export function closeToast(): CloseToastAction {
  return {
    type: ActionTypes.CLOSE_TOAST,
  };
}
