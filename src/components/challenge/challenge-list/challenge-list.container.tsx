import React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import ChallengeList from './challenge-list';
import { changePage } from 'redux/actions/challenge.actions';
import { AppState } from 'redux/reducers/combined.reducer';
import { push } from 'connected-react-router';

class ChallengeListContainer extends React.PureComponent<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    if (this.props.currentPageNumber === -1) {
      this.props.actions.changePage(this.props.nbElementsOnPage, 0);
      return null;
    }
    // FIXME BDX should be sorted directly in backend from database
    const dateSortedChallenges = [...this.props.challenges].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    return (
      <ChallengeList
        challenges={dateSortedChallenges}
        nbElementsOnPage={this.props.nbElementsOnPage}
        currentPageNumber={this.props.currentPageNumber}
        nbPages={this.props.nbPages}
        nbTotalElements={this.props.nbTotalElements}
        actions={this.props.actions}
      />
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    challenges: state.challenge.pagedChallenges?.content ?? [],
    nbElementsOnPage: state.challenge.pagedChallenges?.pageable?.pageSize ?? 10,
    currentPageNumber: state.challenge.pagedChallenges?.pageable?.pageNumber ?? -1,
    nbPages: state.challenge.pagedChallenges?.totalPages ?? 1,
    nbTotalElements: state.challenge.pagedChallenges?.totalElements ?? 0,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(
    {
      changePage: changePage,
      push: push,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeListContainer);
