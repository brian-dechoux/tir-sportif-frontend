import { ActionTypes } from 'redux/actions/action.enum';
import ChallengeState from '../states/challenge.state.type';
import GotChallengesAction from '../actions/got-challenges.action';

const initialState: ChallengeState = {
  pagedChallenge: null
};

type ChallengeActions = GotChallengesAction;

export default function(state: ChallengeState = initialState, action: ChallengeActions) {
  switch (action.type) {

    case ActionTypes.GOT_CHALLENGES:
      return Object.assign({}, state, {
        ...state,
        pagedChallenges: action.pagedChallenges
      });

    default:
      return state;
  }
}
