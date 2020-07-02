import { GetClubResponse } from './club.model';
import { GetCategoryResponse } from './category.model';
import { GetDisciplineResponse } from './discipline.model';
import { CreateAddressRequest, GetAddressResponse } from './address.model';
import { GetShooterResponse } from './shooter.model';

// TODO Redux categories and disciplines.... use IDs here instead of full objects
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

export interface GetShooterParticipationsResponse {
  shooter: GetShooterResponse;

  participations: GetParticipationResponse[];
}

export interface GetParticipationResponse {
  id: number;

  discipline: GetDisciplineResponse;

  useElectronicTarget: boolean;

  paid: boolean;

  outrank: boolean;
}

export interface GetParticipantResponse {
  id: number;

  lastname: string;

  firstname: string;

  clubId: number;

  clubName: string;
}

export interface GetParticipationResultsResponse {
  participationReference: GetParticipationResultReferenceResponse;

  serieResults: GetParticipationSerieResultsResponse[];

  participationTotal: number;
}

export interface GetParticipationSerieResultsResponse {
  points: number[];

  calculatedTotal: number;

  manualTotal?: number;
}

export interface GetParticipationResultReferenceResponse {
  participationId: number;

  nbShotsPerSerie: number,

  outrank: boolean;

  useElectronicTarget: boolean;
}
