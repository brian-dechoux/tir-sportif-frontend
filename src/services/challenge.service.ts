import { GetChallengeResponse } from './models/challenge.model';
import { Page } from './models/page.model';
import cli from '../configurations/http-client.configuration';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

class ChallengeService {

  getChallenges(page: number): Promise<AxiosResponse<Page<GetChallengeResponse>>> {
    const params: AxiosRequestConfig = {
      params: {
        page: page
      }
    };
    return cli.get(
      "/challenges",
      params
    );
  }

}

export default new ChallengeService();
