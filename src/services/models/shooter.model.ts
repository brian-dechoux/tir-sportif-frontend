import { GetAddressResponse } from './address.model';
import { GetClubResponse } from './club.model';
import { GetCategoryResponse } from './category.model';

export interface GetShooterResponse {
  id: number;

  lastname: string;

  firstname: string;

  birthdate: string;

  address?: GetAddressResponse;

  club?: GetClubResponse;

  category?: GetCategoryResponse;
}
