import { Page } from 'services/models/page.model';
import { GetChallengeListElementResponse } from 'services/models/challenge.model';

export interface ChallengeState {
  pagedChallenge: Page<GetChallengeListElementResponse> | null;
}

export default ChallengeState;
