import cli from 'configurations/http-client.configuration';
import { AxiosResponse } from 'axios';
import { GetDisciplineResponse } from './models/discipline.model';

class DisciplineService {
  getDisciplines(): Promise<AxiosResponse<GetDisciplineResponse[]>> {
    return cli.get('/disciplines');
  }

  getDiscipline(disciplineId: number): Promise<AxiosResponse<GetDisciplineResponse>> {
    return cli.get(`/disciplines/${disciplineId}`);
  }
}

export default new DisciplineService();
