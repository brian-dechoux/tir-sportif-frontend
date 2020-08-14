import { applyMiddleware, compose, createStore } from 'redux';
import { createBrowserHistory } from 'history';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import reduxLogger from 'redux-logger';
import { CallHistoryMethodAction, routerMiddleware } from 'connected-react-router';
import createRootReducer from 'redux/reducers/combined.reducer';
import AppState from './redux/states/app.state.type';
import { AuthActions } from './redux/actions/auth.actions';
import { GeneralActions } from './redux/actions/general.actions';
import { ToastActions } from './redux/actions/toast.actions';
import AuthState from './redux/states/auth.state.type';
import GeneralState from './redux/states/general.state.type';
import { GetCountryResponse } from './services/models/country.model';
import { GetCategoryResponse } from './services/models/category.model';
import { GetDisciplineResponse } from './services/models/discipline.model';

export const history = createBrowserHistory();

export type Actions = CallHistoryMethodAction | AuthActions | GeneralActions | ToastActions;

let composeEnhancers;
const middleware = [
  thunk as ThunkMiddleware<AppState, Actions>,
  routerMiddleware(history),
];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(reduxLogger);
  composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
} else {
  composeEnhancers = compose;
}

const initialAuthState: AuthState = {
  token: localStorage.getItem('token'),
};

let countries: GetCountryResponse[];
const localStorageCountries = localStorage.getItem('countries');
if (localStorageCountries) {
  countries = JSON.parse(localStorageCountries);
} else {
  countries = [];
}
let categories: GetCategoryResponse[];
const localStorageCategories = localStorage.getItem('categories');
if (localStorageCategories) {
  categories = JSON.parse(localStorageCategories);
} else {
  categories = [];
}
let disciplines: GetDisciplineResponse[];
const localStorageDisciplines = localStorage.getItem('disciplines');
if (localStorageDisciplines) {
  disciplines = JSON.parse(localStorageDisciplines);
} else {
  disciplines = [];
}

const initialGeneralState: GeneralState = {
  countries: countries,
  categories: categories,
  disciplines: disciplines,
};

const initialState = {
  auth: initialAuthState,
  general: initialGeneralState
}

// TODO fix typescript issues (createStore returns any type...)
export const store = createStore<any, Actions, any, any>(
  createRootReducer(history),
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);
