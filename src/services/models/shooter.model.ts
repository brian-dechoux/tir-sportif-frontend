import { GetClubResponse } from './club.model';
import { GetCategoryResponse } from './category.model';

export interface GetShooterResponse {
  id: number;
  lastname: string;
  firstname: string;
  birthdate: string;
  club?: GetClubResponse;
  category: GetCategoryResponse;
  email?: string;
}

export interface GetSearchShooterResponse {
  id: number;
  lastname: string;
  firstname: string;
  clubName?: string;
  categoryLabel: string;
}

export const getFullName = (shooter: GetSearchShooterResponse | GetShooterResponse) =>
  `${shooter.firstname} ${shooter.lastname}`

export interface CreateShooterRequest {
  lastname: string;
  firstname: string;
  birthdate?: string;
  clubId?: number;
  categoryId: number;
  email?: string;
}

export interface CreateShooterResponse {
  id: number;
  lastname: string;
  firstname: string;
  birthdate?: string;
  clubId?: number;
  categoryId: number;
  email?: string;
}
