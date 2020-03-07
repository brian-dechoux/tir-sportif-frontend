import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers/combined.reducer';
import { ActionTypes } from './action.enum';
import ChallengeService from 'services/challenge.service';
import { push } from 'connected-react-router';
import { ROUTES } from '../../configurations/server.configuration';
import { CreateAddressRequest } from 'services/models/address.model';

export function changePage(
  rowsPerPage: number,
  page: number
): ThunkAction<void, AppState, undefined, any> {
  return (dispatch: ThunkDispatch<AppState, undefined, any>) => {
    ChallengeService.getChallenges(rowsPerPage, page)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: ActionTypes.GOT_CHALLENGES,
            pagedChallenges: response.data,
          });
        }
      })
      .catch(() => {
        dispatch({
          type: ActionTypes.ERROR_OCCURED,
          message: "Une erreur s'est produite",
        });
      });
  };
}

export function createChallenge(
  name: string,
  address: CreateAddressRequest,
  startDate: Date,
  organiserClubId: number,
  categoryIds: number[],
  disciplineIds: number[]
): ThunkAction<void, AppState, undefined, any> {
  return (dispatch: ThunkDispatch<AppState, undefined, any>) => {
    ChallengeService.createChallenge(
      name,
      address,
      startDate,
      organiserClubId,
      categoryIds,
      disciplineIds
    )
      .then(response => {
        // TODO check error handling here with a 500
        if (response.status === 201) {
          dispatch(push(ROUTES.CHALLENGE.LIST));
        }
      })
      .catch(() => {
        dispatch({
          type: ActionTypes.ERROR_OCCURED,
          message: "Une erreur s'est produite durant la création",
        });
      });
  };
}
