import { ActionTypes } from 'redux/actions/action.enum';
import GeneralState from 'redux/states/general.state.type';
import { GeneralActions } from 'redux/actions/general.actions';

const initialState: GeneralState = {
  countries: [],
  categories: [],
  disciplines: [],
};

export default function(state: GeneralState = initialState, action: GeneralActions) {
  switch (action.type) {
    case ActionTypes.GET_COUNTRIES:
      return Object.assign({}, state, {
        ...state,
        countries: action.countries,
      });

    case ActionTypes.GET_CATEGORIES:
      return Object.assign({}, state, {
        ...state,
        categories: action.categories,
      });

    case ActionTypes.GET_DISCIPLINES:
      return Object.assign({}, state, {
        ...state,
        disciplines: action.disciplines,
      });

    default:
      return state;
  }
}
