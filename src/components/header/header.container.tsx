import React from 'react';
import { connect } from 'react-redux';
import { login, logout } from 'redux/actions/auth.actions';
import { bindActionCreators, Dispatch } from 'redux';
import Header from './header';
import { AppState } from 'redux/states/app.state.type';
import { Actions } from 'store';
import { RouteChildrenProps, withRouter } from 'react-router';
import { getCategories, getCountries, getDisciplines } from 'redux/actions/general.actions';

class HeaderContainer extends React.PureComponent<
  RouteChildrenProps<any> & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    const urlFirstPart = this.props.history.location.pathname.toLowerCase().split("/")[1]
    const token = this.props.token;
    return <Header
      isAuthenticated={token != null}
      countries={this.props.countries}
      categories={this.props.categories}
      disciplines={this.props.disciplines}
      actions={this.props.actions}
      urlFirstPart={urlFirstPart}
    />;
  }
}

const mapStateToProps = (state: AppState) => ({
  token: state.auth.token,
  countries: state.general.countries,
  categories: state.general.categories,
  disciplines: state.general.disciplines,
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  actions: bindActionCreators(
    {
      login,
      logout,
      getCountries,
      getCategories,
      getDisciplines
    },
    dispatch
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderContainer));
