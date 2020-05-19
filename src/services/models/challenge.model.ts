import { GetClubResponse } from './club.model';
import { GetCategoryResponse } from './category.model';
import { GetDisciplineResponse } from './discipline.model';
import { CreateAddressRequest, GetAddressResponse } from './address.model';
import { GetShooterResponse } from './shooter.model';

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

export interface GetChallengeResponse {
  id: number;

  name: string;

  startDate: string;

  address: GetAddressResponse;

  club: GetClubResponse;

  categories: GetCategoryResponse[];

  disciplines: GetDisciplineResponse[];
}

export interface CreateParticipationsRequest {
  shooterId: number;
  disciplinesInformation: CreateDisciplineParticipationRequest[];
}

export interface Participation {
  discipline: string;
  useElectronicTarget: boolean;
  outrank: boolean;
  paid: boolean;
}

export interface CreateDisciplineParticipationRequest {
  disciplineId: number;
  useElectronicTarget: boolean;
  paid: boolean;
  outrank: boolean;
}

// TODO Redux categories and disciplines.... use IDs here instead of full objects
export interface GetParticipationResponse {
  id: number;

  shooter: GetShooterResponse;

  category: GetCategoryResponse;

  disciplines: GetDisciplineResponse;

  useElectronicTarget: boolean;

  paid: boolean;

  outrank: boolean;
}
