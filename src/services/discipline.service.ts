import cli from 'configurations/http-client.configuration';
import { AxiosResponse } from 'axios';
import { GetDisciplineResponse } from './models/discipline.model';

export class DisciplineService {
  getDisciplines(): Promise<AxiosResponse<GetDisciplineResponse[]>> {
    return cli.get('/disciplines');
  }
}

export default new DisciplineService();
