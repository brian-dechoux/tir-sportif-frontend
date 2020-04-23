import ChallengeState from 'redux/states/challenge.state.type';

const initialState: ChallengeState = {
  pagedChallenges: null,
};

type ChallengeActions = any;

export default function(state: ChallengeState = initialState, action: ChallengeActions) {
  switch (action.type) {
    default:
      return state;
  }
}
