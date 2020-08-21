import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import ClubList from './club-list';
import { push } from 'connected-react-router';
import { error } from 'redux/actions/error.actions';
import { Actions } from '../../../store';

class ClubListContainer extends React.PureComponent<
  ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    return <ClubList actions={this.props.actions} />;
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

export default connect(null, mapDispatchToProps)(ClubListContainer);
