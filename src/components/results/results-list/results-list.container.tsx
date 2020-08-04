import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import ResultsList from './results-list';
import { Actions } from '../../../store';
import { error } from 'redux/actions/error.actions';
import { push } from 'connected-react-router';
import Desktop from '../../media/desktop';
import Mobile from '../../media/mobile';
import ResultsListMobile from './results-list-mobile';

class ResultsListContainer extends React.PureComponent<ReturnType<typeof mapDispatchToProps>, {}> {
  render() {
    return (
      <>
        <Desktop>
          <ResultsList actions={this.props.actions} />
        </Desktop>
        <Mobile>
          <ResultsListMobile actions={this.props.actions} />
        </Mobile>
      </>
    );
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
