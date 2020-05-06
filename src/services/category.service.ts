import cli from 'configurations/http-client.configuration';
import { AxiosResponse } from 'axios';
import { GetCategoryResponse } from './models/category.model';

export class CategoryService {
  getCategories(): Promise<AxiosResponse<GetCategoryResponse[]>> {
    return cli.get('/categories');
  }
}

export default new CategoryService();
