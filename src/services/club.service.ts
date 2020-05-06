import cli from 'configurations/http-client.configuration';
import { AxiosResponse } from 'axios';
import { GetClubResponse } from './models/club.model';

export class ClubService {
  getClubs(): Promise<AxiosResponse<GetClubResponse[]>> {
    return cli.get('/clubs');
  }
}

export default new ClubService();
