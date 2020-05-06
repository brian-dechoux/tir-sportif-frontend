import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import ChallengeDetail from './challenge-detail';
import { push } from 'connected-react-router';
import { error } from 'redux/actions/error.actions';
import { Actions } from 'store';
import { RouteChildrenProps, withRouter } from 'react-router';
import { ROUTES } from 'configurations/server.configuration';

interface ChallengeDetailRouterProps {
  challengeId: string;
}

class ChallengeDetailContainer extends React.PureComponent<
  RouteChildrenProps<ChallengeDetailRouterProps> & ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    if (this.props.match && this.props.match.params && this.props.match.params.challengeId) {
      const paramChallengeId = this.props.match.params.challengeId;
      const parsedChallengeId = parseInt(paramChallengeId, 10);
      return <ChallengeDetail challengeId={parsedChallengeId} actions={this.props.actions} />;
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

export default withRouter(connect(null, mapDispatchToProps)(ChallengeDetailContainer));
