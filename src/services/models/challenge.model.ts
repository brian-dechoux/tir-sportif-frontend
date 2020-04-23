import { GetClubResponse } from './club.model';
import { GetCategoryResponse } from './category.model';
import { GetDisciplineResponse } from './discipline.model';
import { CreateAddressRequest } from './address.model';

export interface GetChallengeListElementResponse {
  id: number;

  name: string;

  startDate: string;

  city: string;

  nbShooters: number;
}

export interface CreateChallengeResponse {
  id: number;

  name: string;

  address: CreateAddressRequest;

  startDate: string;

  club: GetClubResponse;

  categories: GetCategoryResponse[];

  disciplines: GetDisciplineResponse[];
}
