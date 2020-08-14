import AuthState from './auth.state.type';
import GeneralState from './general.state.type';
import ToastState from './toast.state.type';
import { RouterState } from 'connected-react-router';
import AddShooterState from './add-shooter.state.type';

export interface AppState {
  router: RouterState;
  general: GeneralState;
  auth: AuthState;
  toast: ToastState;
  addShooter: AddShooterState;
}

export default AppState;
