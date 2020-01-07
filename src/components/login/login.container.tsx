import React from 'react';
import { connect } from 'react-redux';
import { login, closeToast } from 'redux/actions/auth.actions';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import Login  from './login';
import { AppState } from '../../redux/reducers/combined.reducer';

class AuthContainer extends React.PureComponent<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  {}
  > {
  render() {
    const token = this.props.token;
    if (token !== null) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    const loginFailedToastMessage: string = this.props.loginFailedToast.message != null ?
      this.props.loginFailedToast.message :
      "Une erreur s'est produite";

    return <Login
      loginFailedToast={{
        ...this.props.loginFailedToast,
        message: loginFailedToastMessage
      }}
      actions={this.props.actions}
    />;
  }
}

const mapStateToProps = (state: AppState) => ({
  token: state.auth.token,
  loginFailedToast: {
    isShown: state.auth.showLoginToast,
    message: state.auth.loginToastMessage
  }
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(
    {
      login,
      closeToast
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer);
