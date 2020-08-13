import { Page } from './models/page.model';
import cli from 'configurations/http-client.configuration';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { GetLicenseeListElementResponse, GetLicenseeResponse } from './models/licensee.model';

class LicenseeService {
  getLicensees(
    rowsPerPage: number,
    page: number
  ): Promise<AxiosResponse<Page<GetLicenseeListElementResponse>>> {
    const params: AxiosRequestConfig = {
      params: {
        page: page,
        rowsPerPage: rowsPerPage,
      },
    };
    return cli.get('/licensees', params);
  }

  getLicensee(id: number): Promise<AxiosResponse<GetLicenseeResponse>> {
    return cli.get(`/licensees/${id}`);
  }

  renewLicensee(id: number): Promise<AxiosResponse<GetLicenseeResponse>> {
    return cli.post(`/licensees/${id}/renew`);
  }
}

export default new LicenseeService();
