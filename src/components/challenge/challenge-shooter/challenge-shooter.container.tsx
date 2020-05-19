import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import ChallengeShooter from './challenge-shooter';
import { push } from 'connected-react-router';
import { error } from 'redux/actions/error.actions';
import { Actions } from 'store';
import { RouteChildrenProps, withRouter } from 'react-router';
import { ROUTES } from 'configurations/server.configuration';

interface ChallengeShooterRouterProps {
  challengeId: string;
  shooterId: string;
}

class ChallengeShooterContainer extends React.PureComponent<
  RouteChildrenProps<ChallengeShooterRouterProps> & ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    if (this.props.match && this.props.match.params && this.props.match.params.challengeId && this.props.match.params.shooterId) {
      const paramChallengeId = this.props.match.params.challengeId;
      const parsedChallengeId = parseInt(paramChallengeId, 10);
      const paramShooterId = this.props.match.params.shooterId;
      const parsedShooterId = parseInt(paramShooterId, 10);
      return <ChallengeShooter challengeId={parsedChallengeId} shooterId={parsedShooterId} actions={this.props.actions} />;
    } else {
      return this.props.actions.push(ROUTES.CHALLENGE.LIST);
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  actions: bindActionCreators(
    {
      error: error,
      push: push,
    },
    dispatch
  ),
});

export default withRouter(connect(null, mapDispatchToProps)(ChallengeShooterContainer));
