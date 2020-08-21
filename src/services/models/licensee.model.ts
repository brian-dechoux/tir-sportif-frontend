import { GetShooterResponse } from './shooter.model';
import { GetAddressResponse } from './address.model';

export interface GetLicenseeResponse {
  id: number;
  badgeNumber: number;
  lockerNumber?: number;
  subscriptionDate: string;
  shooter: GetShooterResponse;
  address: GetAddressResponse;
}

export interface GetLicenseeListElementResponse {
  id: number;
  lastname: string;
  firstname: string;
  subscriptionDate: string;
}

export interface CreateLicenseeRequest {
  badgeNumber: number;
  lockerNumber?: number;
  shooterId: number;
  address: GetAddressResponse;
}
