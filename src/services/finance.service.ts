import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Page } from './models/page.model';
import cli from 'configurations/http-client.configuration';
import { GetShooterFinanceResponse, GetShooterWithBillsListElementResponse } from './models/finance.model';

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
  }

  getShooterFinance(
    shooterId: number
  ): Promise<AxiosResponse<GetShooterFinanceResponse>> {
    return cli.get(`/finances/shooters/${shooterId}`);
  }

  payBill(
    shooterId: number,
    billId: number
  ): Promise<AxiosResponse<GetShooterFinanceResponse>> {
    return cli.post(`/finances/shooters/${shooterId}/bills/${billId}`);
  }
}

export default new FinanceService();
