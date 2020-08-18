import { CreateAddressRequest, GetAddressResponse } from './address.model';

export interface GetClubResponse {
  id: number;
  name: string;
  address: GetAddressResponse;
  email: string;
}

export interface GetClubListElementResponse {
  id: number;
  name: string;
  city: string;
  nbShooters: number;
}

export interface CreateClubRequest {
  name: string;
  address: CreateAddressRequest;
  email: string;
}
