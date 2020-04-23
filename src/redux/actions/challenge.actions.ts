import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducers/combined.reducer';
import { ActionTypes } from './action.enum';
import ChallengeService from 'services/challenge.service';
import { push } from 'connected-react-router';
import { ROUTES } from '../../configurations/server.configuration';
import { CreateAddressRequest } from 'services/models/address.model';

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
