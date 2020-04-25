import axios, { AxiosRequestConfig } from 'axios';
import Configuration from 'configurations/environment.configuration';
import { store } from '../store';
import { error } from 'redux/actions/error.actions';
import { expireToken } from 'redux/actions/auth.actions';

const cli = axios.create({
  baseURL: Configuration.backendUrl,
  timeout: 3000,
});

cli.interceptors.response.use(
  onFulfilled => onFulfilled,
  onRejected => {
    if (onRejected.response.status === 401) {
      store.dispatch(expireToken());
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
