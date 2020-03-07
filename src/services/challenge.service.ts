import { CreateChallengeResponse, GetChallengeListElementResponse } from './models/challenge.model';
import { Page } from './models/page.model';
import cli from '../configurations/http-client.configuration';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CreateAddressRequest } from './models/address.model';

class ChallengeService {
  getChallenges(
    rowsPerPage: number,
    page: number
  ): Promise<AxiosResponse<Page<GetChallengeListElementResponse>>> {
    const params: AxiosRequestConfig = {
      params: {
        page: page,
        rowsPerPage: rowsPerPage,
      },
    };
    return cli.get('/challenges', params);
  }

  createChallenge(
    name: string,
    address: CreateAddressRequest,
    startDate: Date,
    organiserClubId: number,
    categoryIds: number[],
    disciplineIds: number[]
  ): Promise<AxiosResponse<CreateChallengeResponse>> {
    const payload = {
      name: name,
      address: address,
      startDate: startDate,
      organiserClubId: organiserClubId,
      categoryIds: categoryIds,
      disciplineIds: disciplineIds,
    };
    return cli.post('/challenges', payload);
  }
}

export default new ChallengeService();
