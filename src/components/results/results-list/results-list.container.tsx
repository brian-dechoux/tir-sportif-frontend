import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import ResultsList from './results-list';
import { Actions } from '../../../store';
import { error } from 'redux/actions/error.actions';
import { push } from 'connected-react-router';

class ResultsListContainer extends React.PureComponent<ReturnType<typeof mapDispatchToProps>, {}> {
  render() {
    return <ResultsList actions={this.props.actions} />;
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

export default connect(null, mapDispatchToProps)(ResultsListContainer);
