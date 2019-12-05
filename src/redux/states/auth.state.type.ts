export interface AuthState {
  token: string | null;
  showLoginToast: boolean;
  loginToastMessage: string | null;
}

export default AuthState;
