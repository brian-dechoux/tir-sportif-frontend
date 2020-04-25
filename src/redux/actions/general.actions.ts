import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import AppState from 'redux/states/app.state.type';
import { BaseAction } from './base.action';
import { ActionTypes } from './action.enum';
import CountryService from 'services/country.service';
import { error } from './error.actions';
import { GetCountryResponse } from '../../services/models/country.model';

export interface GetCountriesAction extends BaseAction {
  type: ActionTypes.GET_COUNTRIES;
  countries: GetCountryResponse[];
}

export function getCountries(): ThunkAction<void, AppState, undefined, any> {
  return (dispatch: ThunkDispatch<AppState, undefined, any>) => {
    CountryService.getCountries()
      .then(response => {
        dispatch({
          type: ActionTypes.GET_COUNTRIES,
          countries: response.data,
        });
      })
      .catch(() => dispatch(error('Impossible de récupérer la liste des pays')));
  };
}
