import { GetAddressResponse } from './address.model';

export interface GetClubResponse {
  address?: GetAddressResponse;

  id?: number;

  name?: string;
}
