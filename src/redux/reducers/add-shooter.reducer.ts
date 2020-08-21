import { ActionTypes } from 'redux/actions/action.enum';
import AddShooterState from '../states/add-shooter.state.type';
import { AddShooterActions } from '../actions/add-shooter.actions';

const initialState: AddShooterState = {
  callback: () => Promise.reject(),
  firstname: '',
  lastname: '',
  resolved: false
};

export default function(state: AddShooterState = initialState, action: AddShooterActions) {
  switch (action.type) {
    case ActionTypes.ADD_SHOOTER:
      return Object.assign({}, state, {
        ...state,
        callback: action.callback,
        firstname: action.firstname,
        lastname: action.lastname,
        resolved: true,
      });

    case ActionTypes.RESET_SHOOTER:
      return Object.assign({}, state, {
        ...state,
        resolved: false,
      });

    default:
      return state;
  }
}
