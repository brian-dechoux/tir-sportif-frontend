import cli from 'configurations/http-client.configuration';
import { AxiosResponse } from 'axios';
import { GetCountryResponse } from './models/country.model';

export class CountryService {
  getCountries(): Promise<AxiosResponse<GetCountryResponse[]>> {
    return cli.get('/countries');
  }
}

export default new CountryService();
