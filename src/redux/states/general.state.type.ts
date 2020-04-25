import { GetCountryResponse } from 'services/models/country.model';

// TODO add categories and disciplines in here ?
export interface GeneralState {
  countries: GetCountryResponse[];
}

export default GeneralState;
