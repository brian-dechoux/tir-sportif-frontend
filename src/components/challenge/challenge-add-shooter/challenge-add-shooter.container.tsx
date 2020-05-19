import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import ChallengeAddShooter from './challenge-add-shooter';
import { error } from 'redux/actions/error.actions';
import { push } from 'connected-react-router';
import { openToast } from 'redux/actions/toast.actions';
import { Actions } from '../../../store';
import AppState from 'redux/states/app.state.type';
import { getCountries } from 'redux/actions/general.actions';
import { ROUTES } from 'configurations/server.configuration';
import { RouteChildrenProps, withRouter } from 'react-router';

interface ChallengeAddShooterRouterProps {
  challengeId: string;
}

class ChallengeAddShooterContainer extends React.PureComponent<
  RouteChildrenProps<ChallengeAddShooterRouterProps> &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    if (this.props.countries.length === 0) {
      // TODO BDX put it in local storage
      this.props.actions.getCountries();
    }
    if (this.props.match && this.props.match.params && this.props.match.params.challengeId) {
      const paramChallengeId = this.props.match.params.challengeId;
      const parsedChallengeId = parseInt(paramChallengeId, 10);
      const props = {
        ...this.props,
        challengeId: parsedChallengeId,
      };
      return <ChallengeAddShooter {...props} />;
    } else {
      return this.props.actions.push(ROUTES.CHALLENGE.LIST);
    }
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    countries: state.general.countries,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  actions: bindActionCreators(
    {
      error: error,
      openToast: openToast,
      push: push,
      getCountries: getCountries,
    },
    dispatch
  ),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ChallengeAddShooterContainer)
);
