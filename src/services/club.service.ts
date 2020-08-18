import cli from 'configurations/http-client.configuration';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { GetClubListElementResponse, GetClubResponse } from './models/club.model';
import { CreateAddressRequest } from './models/address.model';
import { Page } from './models/page.model';

class ClubService {

  getClubs(): Promise<AxiosResponse<GetClubResponse[]>> {
    return cli.get('/clubs');
  }

  searchClubs(
    rowsPerPage: number,
    page: number
  ): Promise<AxiosResponse<Page<GetClubListElementResponse>>> {
    const params: AxiosRequestConfig = {
      params: {
        page: page,
        rowsPerPage: rowsPerPage,
      },
    };
    return cli.get('/clubs/search', params);
  }

  getMyClub(): Promise<AxiosResponse<GetClubResponse>> {
    return cli.get('/clubs/my');
  }

  createClub(
    name: string,
    address: CreateAddressRequest
  ): Promise<AxiosResponse<GetClubResponse>> {
    const payload = {
      name: name,
      address: address
    };
    return cli.post('/clubs', payload, {});
  }
}

export default new ClubService();
