import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AppState } from '../reducers/combined.reducer';
import { ActionTypes } from './action.enum';
import ChallengeService from '../../services/challenge.service';

export function getChallenges(page: number): ThunkAction<void, AppState, undefined, any> {
  return (
    dispatch: ThunkDispatch<AppState, undefined, any>
  ) => {

    ChallengeService.getChallenges(page)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: ActionTypes.GOT_CHALLENGES,
            pagedChallenges: response.data
          });
        }
      }).catch(() => {
        dispatch({
          type: ActionTypes.ERROR_OCCURED,
          message: "Une erreur s'est produite"
        });
      });
  };
}
