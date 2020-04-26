import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import ChallengeCreation from './challenge-creation';
import { error } from 'redux/actions/error.actions';
import { push } from 'connected-react-router';
import { openToast } from 'redux/actions/toast.actions';
import { Actions } from '../../../store';

class ChallengeCreationContainer extends React.PureComponent<
  ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    return <ChallengeCreation actions={this.props.actions} />;
  }
}

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

export default connect(null, mapDispatchToProps)(ChallengeCreationContainer);
