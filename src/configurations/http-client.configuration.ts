import axios, { AxiosRequestConfig } from 'axios';
import Configuration from 'configurations/environment.configuration';
import { store } from '../store';
import { ROUTES } from './server.configuration';
import { error } from 'redux/actions/error.actions';
import { push } from 'connected-react-router';

const cli = axios.create({
  baseURL: Configuration.backendUrl,
  timeout: 3000,
});

cli.interceptors.response.use(
  onFulfilled => onFulfilled,
  onRejected => {
    if (onRejected.response.status === 401) {
      error('Vous avez été déconnecté');
      push(ROUTES.RESULTS);
    }
    return Promise.reject(error);
  }
);

cli.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = store.getState().auth.token;
  if (token !== null) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default cli;
