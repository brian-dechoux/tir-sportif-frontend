import React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import ChallengeList from './challenge-list';
import { push } from 'connected-react-router';
import { error } from 'redux/actions/error.actions';

class ChallengeListContainer extends React.PureComponent<
  ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    return <ChallengeList actions={this.props.actions} />;
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(
    {
      error: error,
      push: push,
    },
    dispatch
  ),
});

export default connect(null, mapDispatchToProps)(ChallengeListContainer);
