import { ActionTypes } from 'redux/actions/action.enum';
import CloseToastAction from '../actions/close-toast.action';
import ToastState from '../states/toast.state.type';
import OpenToastAction from '../actions/open-toast.action';

const initialState: ToastState = {
  isShown: false,
  message: '',
};

type ToastActions = OpenToastAction | CloseToastAction;

export default function(state: ToastState = initialState, action: ToastActions) {
  switch (action.type) {
    case ActionTypes.OPEN_TOAST:
      return Object.assign({}, state, {
        ...state,
        isShown: true,
        message: action.message,
      });

    case ActionTypes.CLOSE_TOAST:
      return Object.assign({}, state, {
        ...state,
        isShown: false,
        message: '',
      });

    default:
      return state;
  }
}
