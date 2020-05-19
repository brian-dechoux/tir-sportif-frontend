import cli from 'configurations/http-client.configuration';
import { AxiosResponse } from 'axios';
import {
  CreateShooterRequest,
  CreateShooterResponse,
  GetShooterResponse,
} from './models/shooter.model';

export class ShooterService {
  getShooter(id: number): Promise<AxiosResponse<GetShooterResponse>> {
    return cli.get(`/shooters/${id}`);
  }

  createShooter(shooter: CreateShooterRequest): Promise<AxiosResponse<CreateShooterResponse>> {
    return cli.post('/shooters', shooter, {});
  }
}

export default new ShooterService();
