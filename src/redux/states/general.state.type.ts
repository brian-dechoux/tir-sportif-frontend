import { GetCountryResponse } from 'services/models/country.model';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import { GetCategoryResponse } from 'services/models/category.model';

export interface GeneralState {
  countries: GetCountryResponse[];
  categories: GetCategoryResponse[];
  disciplines: GetDisciplineResponse[];
}

export default GeneralState;
