import React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import ChallengeCreation from './challenge-creation';
import { error } from 'redux/actions/error.actions';
import { push } from 'connected-react-router';
import { openToast } from 'redux/actions/toast.actions';

class ChallengeCreationContainer extends React.PureComponent<
  ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    return <ChallengeCreation actions={this.props.actions} />;
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
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
