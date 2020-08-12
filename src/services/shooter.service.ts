import cli from 'configurations/http-client.configuration';
import { AxiosResponse } from 'axios';
import {
  CreateShooterRequest,
  CreateShooterResponse, GetSearchShooterResponse,
  GetShooterResponse,
} from './models/shooter.model';

class ShooterService {
  getShooter(id: number): Promise<AxiosResponse<GetShooterResponse>> {
    return cli.get(`/shooters/${id}`);
  }

  searchShooter(searchName: string): Promise<AxiosResponse<GetSearchShooterResponse[]>> {
    return cli.get(`/shooters/search?searchName=${searchName}`);
  }

  createShooter(shooter: CreateShooterRequest): Promise<AxiosResponse<CreateShooterResponse>> {
    return cli.post('/shooters', shooter, {});
  }
}

export default new ShooterService();
