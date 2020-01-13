import React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import ChallengeList from './challenge-list';
import { getChallenges } from 'redux/actions/challenge.actions';
import { AppState } from 'redux/reducers/combined.reducer';

class ChallengeListContainer extends React.PureComponent<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  {}
  > {
  render() {
    return <ChallengeList
      challenges={this.props.challenges}
      nbElementsOnPage={this.props.nbElementsOnPage}
      currentPageNumber={this.props.currentPageNumber}
      nbPages={this.props.nbPages}
      nbTotalElements={this.props.nbTotalElements}
      actions={this.props.actions}
    />;
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    challenges: state.challenge.pagedChallenge?.content ?? [],
    nbElementsOnPage: state.challenge.pagedChallenge?.pageable?.pageSize ?? 10,
    currentPageNumber: state.challenge.pagedChallenge?.pageable?.pageNumber ?? 0,
    nbPages: state.challenge.pagedChallenge?.totalPages ?? 1,
    nbTotalElements: state.challenge.pagedChallenge?.totalElements ?? 0
  }
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(
    {
      getChallenges
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChallengeListContainer);
