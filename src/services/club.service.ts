import cli from 'configurations/http-client.configuration';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { GetClubListElementResponse, GetClubResponse } from './models/club.model';
import { CreateAddressRequest } from './models/address.model';
import { Page } from './models/page.model';
import { GetShooterListElementResponse, GetShooterResponse } from './models/shooter.model';

class ClubService {

  getClubs(withMyClub?: boolean): Promise<AxiosResponse<GetClubResponse[]>> {
    return cli.get(`/clubs${withMyClub ? '?withMyClub='+withMyClub : ''}`);
  }

  getClub(clubId: number): Promise<AxiosResponse<GetClubResponse>> {
    return cli.get(`/clubs/${clubId}`);
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

  getShooters(
    clubId: number,
    rowsPerPage: number,
    page: number
  ): Promise<AxiosResponse<Page<GetShooterListElementResponse>>> {
    const params: AxiosRequestConfig = {
      params: {
        page: page,
        rowsPerPage: rowsPerPage,
      },
    };
    return cli.get(`/clubs/${clubId}/shooters`, params);
  }

  getMyClub(): Promise<AxiosResponse<GetClubResponse>> {
    return cli.get('/clubs/my');
  }

  createClub(
    name: string,
    email: string,
    address: CreateAddressRequest
  ): Promise<AxiosResponse<GetClubResponse>> {
    const payload = {
      name: name,
      address: address,
      email: email
    };
    return cli.post('/clubs', payload, {});
  }

  associateShooter(
    clubId: number,
    shooterId: number
  ): Promise<AxiosResponse<GetShooterResponse>> {
    return cli.post(`/clubs/${clubId}/shooters/${shooterId}/associate`);
  }
}

export default new ClubService();
