import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import ChallengeList from './challenge-list';
import { push } from 'connected-react-router';
import { error } from 'redux/actions/error.actions';
import { Actions } from '../../../store';

class ChallengeListContainer extends React.PureComponent<
  ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    return <ChallengeList actions={this.props.actions} />;
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

export default connect(null, mapDispatchToProps)(ChallengeListContainer);
