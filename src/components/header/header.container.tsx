import React from 'react';
import { connect } from 'react-redux';
import { login, logout } from 'redux/actions/auth.actions';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import Header from './header';
import { AppState } from 'redux/states/app.state.type';

class HeaderContainer extends React.PureComponent<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    const token = this.props.token;
    if (token != null) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }

    return <Header isAuthenticated={token != null} actions={this.props.actions} />;
  }
}

const mapStateToProps = (state: AppState) => ({
  token: state.auth.token,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(
    {
      login,
      logout,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
