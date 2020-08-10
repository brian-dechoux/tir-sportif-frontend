import React from 'react';
import { connect } from 'react-redux';
import { login, logout } from 'redux/actions/auth.actions';
import { bindActionCreators, Dispatch } from 'redux';
import Header from './header';
import { AppState } from 'redux/states/app.state.type';
import { Actions } from '../../store';
import { RouteChildrenProps, withRouter } from 'react-router';

class HeaderContainer extends React.PureComponent<
  RouteChildrenProps<any> & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    const urlFirstPart = this.props.history.location.pathname.toLowerCase().split("/")[1]
    const token = this.props.token;
    return <Header isAuthenticated={token != null} actions={this.props.actions} urlFirstPart={urlFirstPart} />;
  }
}

const mapStateToProps = (state: AppState) => ({
  token: state.auth.token,
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  actions: bindActionCreators(
    {
      login,
      logout,
    },
    dispatch
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderContainer));
