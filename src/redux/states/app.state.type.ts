import AuthState from './auth.state.type';
import GeneralState from './general.state.type';
import ToastState from './toast.state.type';
import { RouterState } from 'connected-react-router';

export interface AppState {
  general: GeneralState;
  auth: AuthState;
  toast: ToastState;
}

export default AppState;
