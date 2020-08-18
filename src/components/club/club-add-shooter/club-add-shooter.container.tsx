import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import ClubAddShooter from './club-add-shooter';
import { error } from 'redux/actions/error.actions';
import { push } from 'connected-react-router';
import { openToast } from 'redux/actions/toast.actions';
import { Actions } from 'store';
import AppState from 'redux/states/app.state.type';
import { getCountries } from 'redux/actions/general.actions';
import { ROUTES } from 'configurations/server.configuration';
import { RouteChildrenProps, withRouter } from 'react-router';
import { resetShooter } from 'redux/actions/add-shooter.actions';

interface ClubAddShooterRouterProps {
  clubId: string;
}

class ClubAddShooterContainer extends React.PureComponent<
  RouteChildrenProps<ClubAddShooterRouterProps> &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    if (this.props.countries.length === 0) {
      this.props.actions.getCountries();
    }
    if (this.props.match && this.props.match.params && this.props.match.params.clubId) {
      const paramClubId = this.props.match.params.clubId;
      const parsedClubId = parseInt(paramClubId, 10);
      const props = {
        ...this.props,
        clubId: parsedClubId,
      };
      return <ClubAddShooter {...props} />;
    } else {
      return this.props.actions.push(ROUTES.CLUBS.LIST);
    }
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    countries: state.general.countries,
    categories: state.general.categories,
    callbackShooterFn: state.addShooter.callback,
    shooterResolved: state.addShooter.resolved,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  actions: bindActionCreators(
    {
      error: error,
      openToast: openToast,
      push: push,
      getCountries: getCountries,
      resetShooter: resetShooter,
    },
    dispatch
  ),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ClubAddShooterContainer)
);
