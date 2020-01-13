import { ActionTypes } from 'redux/actions/action.enum';
import { BaseAction } from 'redux/actions/base.action';
import { GetChallengeListElementResponse } from '../../services/models/challenge.model';
import { Page } from '../../services/models/page.model';

export interface GotChallengesAction extends BaseAction {
  type: ActionTypes.GOT_CHALLENGES;
  pagedChallenges: Page<GetChallengeListElementResponse>;
}

export default GotChallengesAction;
