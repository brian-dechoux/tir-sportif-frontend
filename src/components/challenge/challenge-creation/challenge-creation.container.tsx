import React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import ChallengeCreation from './challenge-creation';
import { changePage } from 'redux/actions/challenge.actions';
import { AppState } from '../../../redux/reducers/combined.reducer';

class ChallengeCreationContainer extends React.PureComponent<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    return <ChallengeCreation actions={this.props.actions} />;
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    router: state.router,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(
    {
      changePage: changePage,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeCreationContainer);
