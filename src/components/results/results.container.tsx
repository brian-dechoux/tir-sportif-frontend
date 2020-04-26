import React from 'react';
import { connect } from 'react-redux';
import { login } from 'redux/actions/auth.actions';
import { bindActionCreators, Dispatch } from 'redux';
import Results from './results';
import { Actions } from '../../store';

class ResultsContainer extends React.PureComponent<ReturnType<typeof mapDispatchToProps>, {}> {
  render() {
    return <Results />;
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  actions: bindActionCreators(
    {
      login,
    },
    dispatch
  ),
});

export default connect(null, mapDispatchToProps)(ResultsContainer);
