import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { error } from 'redux/actions/error.actions';
import { push } from 'connected-react-router';
import { openToast } from 'redux/actions/toast.actions';
import { Actions } from '../../../store';
import AppState from 'redux/states/app.state.type';
import { resetShooter } from '../../../redux/actions/add-shooter.actions';
import { GetDisciplineResponse } from '../../../services/models/discipline.model';
import ChallengeDisciplineParticipation from './challenge-discipline-participation';

interface ChallengeDisciplineParticipationContainerProps {
  challengeId: number;
  disciplines: GetDisciplineResponse[];
}

class ChallengeDisciplineParticipationContainer extends React.PureComponent<
    ChallengeDisciplineParticipationContainerProps &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    return <ChallengeDisciplineParticipation {...this.props} />;
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    countries: state.general.countries,
    callbackShooterFn: state.addShooter.callback,
    shooterFirstname: state.addShooter.firstname,
    shooterLastname: state.addShooter.lastname,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  actions: bindActionCreators(
    {
      error: error,
      openToast: openToast,
      push: push,
      resetShooter: resetShooter,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeDisciplineParticipationContainer);
