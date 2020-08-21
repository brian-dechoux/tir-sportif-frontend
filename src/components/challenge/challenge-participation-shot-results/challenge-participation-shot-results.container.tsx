import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { push } from 'connected-react-router';
import { error } from 'redux/actions/error.actions';
import { Actions } from 'store';
import { RouteChildrenProps, withRouter } from 'react-router';
import { ROUTES } from 'configurations/server.configuration';
import ChallengeParticipationShotResults from './challenge-participation-shot-results';
import { openToast } from 'redux/actions/toast.actions';
import AppState from '../../../redux/states/app.state.type';

interface ChallengeShotResultsRouterProps {
  challengeId: string;
  shooterId: string;
  disciplineId: string;
  participationId: string;
}

class ChallengeParticipationShotResultsContainer extends React.PureComponent<
  RouteChildrenProps<ChallengeShotResultsRouterProps> &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    if (this.props.match && this.props.match.params && this.props.match.params.challengeId && this.props.match.params.shooterId &&
      this.props.match.params.disciplineId && this.props.match.params.participationId) {
      const paramChallengeId = this.props.match.params.challengeId;
      const parsedChallengeId = parseInt(paramChallengeId, 10);
      const paramShooterId = this.props.match.params.shooterId;
      const parsedShooterId = parseInt(paramShooterId, 10);
      const paramDisciplineId = this.props.match.params.disciplineId;
      const parsedDisciplineId = parseInt(paramDisciplineId, 10);
      const paramParticipationId = this.props.match.params.participationId;
      const parsedParticipationId = parseInt(paramParticipationId, 10);
      const discipline = this.props.disciplines.find(discipline => discipline.id === parsedDisciplineId);
      if (!discipline) {
        this.props.actions.error('Discipline inconnue');
        this.props.actions.push(ROUTES.CHALLENGE.LIST)
      } else {
        return <ChallengeParticipationShotResults
          challengeId={parsedChallengeId}
          shooterId={parsedShooterId}
          discipline={discipline}
          participationId={parsedParticipationId}
          actions={this.props.actions}
        />;
      }
    } else {
      return this.props.actions.push(ROUTES.CHALLENGE.LIST);
    }
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    countries: state.general.countries,
    disciplines: state.general.disciplines,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  actions: bindActionCreators(
    {
      error: error,
      openToast: openToast,
      push: push,
    },
    dispatch
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChallengeParticipationShotResultsContainer));
