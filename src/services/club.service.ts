import cli from 'configurations/http-client.configuration';
import { AxiosResponse } from 'axios';
import { GetClubResponse } from './models/club.model';

class ClubService {
  getClubs(): Promise<AxiosResponse<GetClubResponse[]>> {
    return cli.get('/clubs');
  }

  getMyClub(): Promise<AxiosResponse<GetClubResponse>> {
    return cli.get('/clubs/my');
  }
}

export default new ClubService();
