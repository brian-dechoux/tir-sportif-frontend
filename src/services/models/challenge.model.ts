import { GetClubResponse } from './club.model';
import { GetCategoryResponse } from './category.model';
import { GetDisciplineResponse } from './discipline.model';
import { CreateAddressRequest } from './address.model';

export interface GetChallengeListElementResponse {
  id: number;

  name: string;

  startDate: Date;

  city: string;

  nbShooters: number;
}

export interface CreateChallengeResponse {
  id: number;

  name: string;

  address: CreateAddressRequest;

  startDate: Date;

  club: GetClubResponse;

  categories: GetCategoryResponse[];

  disciplines: GetDisciplineResponse[];
}
