import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Page } from './models/page.model';
import cli from 'configurations/http-client.configuration';
import { GetShooterWithBillsListElementResponse } from './models/finance.model';

class FinanceService {
  getShootersWithBills(
    rowsPerPage: number,
    page: number
  ): Promise<AxiosResponse<Page<GetShooterWithBillsListElementResponse>>> {
    const params: AxiosRequestConfig = {
      params: {
        page: page,
        rowsPerPage: rowsPerPage,
      },
    };
    return cli.get('/finances/shooters', params);
  }}

export default new FinanceService();
