import axios, { AxiosRequestConfig } from 'axios';
import Configuration from 'configurations/environment.configuration'
import { store } from '../store';

const cli = axios.create({
  baseURL: Configuration.backendUrl,
  timeout: 3000
});

// TODO add intrerceptor for 401, redirect to login

cli.interceptors.request.use( (config: AxiosRequestConfig) => {
  const token = store.getState().auth.token;
  if (token !== null) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default cli;
