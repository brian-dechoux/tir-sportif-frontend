import { ActionTypes } from 'redux/actions/action.enum';
import GeneralState from 'redux/states/general.state.type';
import { GetCountriesAction } from 'redux/actions/general.actions';

const initialState: GeneralState = {
  countries: [],
};

type GeneralActions = GetCountriesAction;

export default function(state: GeneralState = initialState, action: GeneralActions) {
  switch (action.type) {
    case ActionTypes.GET_COUNTRIES:
      return Object.assign({}, state, {
        ...state,
        countries: action.countries,
      });

    default:
      return state;
  }
}
