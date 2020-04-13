import React from 'react';
import { connect } from 'react-redux';
import { closeToast, login, logout } from 'redux/actions/auth.actions';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import Header from './header';
import { AppState } from '../../redux/reducers/combined.reducer';

class HeaderContainer extends React.PureComponent<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    const token = this.props.token;

    // TODO move localStorage to action, it doesn't make sense here as it's a side effect
    if (token != null) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }

    const loginFailedToastMessage: string =
      this.props.loginFailedToast.message != null
        ? this.props.loginFailedToast.message
        : "Une erreur s'est produite";

    return <Header
      isAuthenticated={token != null}
      loginFailedToast={{
        ...this.props.loginFailedToast,
        message: loginFailedToastMessage,
      }}
      actions={this.props.actions}
    />;
  }
}

const mapStateToProps = (state: AppState) => ({
  token: state.auth.token,
  loginFailedToast: {
    isShown: state.auth.showLoginToast,
    message: state.auth.loginToastMessage,
  },
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(
    {
      login,
      logout,
      closeToast,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
