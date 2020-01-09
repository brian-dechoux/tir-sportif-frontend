import { GetAddressResponse } from './address.model';
import { GetCategoryResponse } from './category.model';
import { GetClubResponse } from './club.model';
import { GetDisciplineResponse } from './discipline.model';

export interface GetChallengeResponse {

  address?: GetAddressResponse;

  categories?: Array<GetCategoryResponse>;

  club?: GetClubResponse;

  disciplines?: Array<GetDisciplineResponse>;

  id?: number;

  name?: string;

  startDate?: Date;

}
