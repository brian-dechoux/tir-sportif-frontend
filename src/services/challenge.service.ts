import { GetChallengeListElementResponse } from './models/challenge.model';
import { Page } from './models/page.model';
import cli from '../configurations/http-client.configuration';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

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
}

export default new ChallengeService();
