import { CreateAddressRequest, GetAddressResponse } from './address.model';
import { GetClubResponse } from './club.model';
import { GetCategoryResponse } from './category.model';

export interface GetShooterResponse {
  id: number;

  lastname: string;

  firstname: string;

  birthdate: string;

  address?: GetAddressResponse;

  club?: GetClubResponse;

  category: GetCategoryResponse;
}

export interface CreateShooterRequest {
  lastname: string;

  firstname: string;

  birthdate?: string;

  address?: CreateAddressRequest;

  clubId?: number;

  categoryId: number;
}

export interface CreateShooterResponse {
  id: number;

  lastname: string;

  firstname: string;

  birthdate?: string;

  address?: CreateAddressRequest;

  clubId?: number;

  categoryId: number;
}
