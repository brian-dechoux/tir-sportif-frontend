import { ToastVariant } from '../../components/toast/toast';

export interface ToastState {
  isShown: boolean;
  message: string;
  variant: ToastVariant;
}

export default ToastState;
