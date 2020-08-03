import { GetCountryResponse } from 'services/models/country.model';

export interface GeneralState {
  countries: GetCountryResponse[];
}

export default GeneralState;
