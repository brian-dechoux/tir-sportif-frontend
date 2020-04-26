import { ActionTypes } from 'redux/actions/action.enum';
import AuthState from 'redux/states/auth.state.type';
import { AuthActions } from 'redux/actions/auth.actions';

const initialState: AuthState = {
  token: null,
};

export default function(state: AuthState = initialState, action: AuthActions) {
  switch (action.type) {
    case ActionTypes.LOGIN:
      return Object.assign({}, state, {
        ...state,
        token: action.token,
      });

    case ActionTypes.LOGOUT:
      return Object.assign({}, state, {
        ...state,
        token: null,
      });

    case ActionTypes.EXPIRE_TOKEN:
      return Object.assign({}, state, {
        ...state,
        token: null,
      });

    default:
      return state;
  }
}
