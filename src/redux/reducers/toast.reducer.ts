import { ActionTypes } from 'redux/actions/action.enum';
import ToastState from 'redux/states/toast.state.type';
import { ToastActions } from '../actions/toast.actions';

const initialState: ToastState = {
  isShown: false,
  message: '',
  variant: 'success',
};

export default function(state: ToastState = initialState, action: ToastActions) {
  switch (action.type) {
    case ActionTypes.OPEN_TOAST:
      return Object.assign({}, state, {
        ...state,
        isShown: true,
        message: action.message,
        variant: action.variant,
      });

    case ActionTypes.CLOSE_TOAST:
      return Object.assign({}, state, {
        ...state,
        isShown: false,
      });

    default:
      return state;
  }
}
