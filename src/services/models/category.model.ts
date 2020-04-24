export interface GetCategoryResponse {
  ageMax: number;

  ageMin: number;

  code: string;

  gender: GenderEnum;

  id: number;

  label: string;
}

export enum GenderEnum {
  M = 'M',
  F = 'F',
}
