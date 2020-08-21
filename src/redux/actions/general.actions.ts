import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import AppState from 'redux/states/app.state.type';
import { BaseAction } from './base.action';
import { ActionTypes } from './action.enum';
import CountryService from 'services/country.service';
import CategoryService from 'services/category.service';
import DisciplineService from 'services/discipline.service';
import { error } from './error.actions';
import { GetCountryResponse } from 'services/models/country.model';
import { Actions } from '../../store';
import { GetCategoryResponse } from '../../services/models/category.model';
import { GetDisciplineResponse } from '../../services/models/discipline.model';

export interface GetCountriesAction extends BaseAction {
  type: ActionTypes.GET_COUNTRIES;
  countries: GetCountryResponse[];
}

export interface GetCategoriesAction extends BaseAction {
  type: ActionTypes.GET_CATEGORIES;
  categories: GetCategoryResponse[];
}

export interface GetDisciplinesAction extends BaseAction {
  type: ActionTypes.GET_DISCIPLINES;
  disciplines: GetDisciplineResponse[];
}

export type GeneralActions = GetCountriesAction | GetCategoriesAction | GetDisciplinesAction;

export function getCountries(): ThunkAction<void, AppState, undefined, Actions> {
  return (dispatch: ThunkDispatch<AppState, undefined, Actions>) => {
    CountryService.getCountries()
      .then(response => {
        localStorage.setItem('countries', JSON.stringify(response.data));
        dispatch({
          type: ActionTypes.GET_COUNTRIES,
          countries: response.data,
        });
      })
      .catch(() => dispatch(error('Impossible de récupérer la liste des pays')));
  };
}

export function getCategories(): ThunkAction<void, AppState, undefined, Actions> {
  return (dispatch: ThunkDispatch<AppState, undefined, Actions>) => {
    CategoryService.getCategories()
      .then(response => {
        localStorage.setItem('categories', JSON.stringify(response.data));
        dispatch({
          type: ActionTypes.GET_CATEGORIES,
          categories: response.data,
        });
      })
      .catch(() => dispatch(error('Impossible de récupérer la liste des catégories')));
  };
}

export function getDisciplines(): ThunkAction<void, AppState, undefined, Actions> {
  return (dispatch: ThunkDispatch<AppState, undefined, Actions>) => {
    DisciplineService.getDisciplines()
      .then(response => {
        localStorage.setItem('disciplines', JSON.stringify(response.data));
        dispatch({
          type: ActionTypes.GET_DISCIPLINES,
          disciplines: response.data,
        });
      })
      .catch(() => dispatch(error('Impossible de récupérer la liste des disciplines')));
  };
}
