import {
  CreateChallengeResponse,
  CreateParticipationsRequest,
  GetChallengeListElementResponse,
  GetChallengeResponse,
  GetParticipantResponse,
  GetShooterParticipationsResponse,
} from './models/challenge.model';
import { Page } from './models/page.model';
import cli from 'configurations/http-client.configuration';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CreateAddressRequest } from './models/address.model';
import { formatDate } from 'utils/date.utils';
import { dateTheme } from 'configurations/theme.configuration';

export class ChallengeService {
  getChallenges(
    rowsPerPage: number,
    page: number
  ): Promise<AxiosResponse<Page<GetChallengeListElementResponse>>> {
    const params: AxiosRequestConfig = {
      params: {
        page: page,
        rowsPerPage: rowsPerPage,
      },
    };
    return cli.get('/challenges', params);
  }

  getChallenge(id: number): Promise<AxiosResponse<GetChallengeResponse>> {
    return cli.get(`/challenges/${id}`);
  }

  getParticipants(
    challengeId: number,
    rowsPerPage: number,
    page: number
  ): Promise<AxiosResponse<Page<GetParticipantResponse>>> {
    const params: AxiosRequestConfig = {
      params: {
        page: page,
        rowsPerPage: rowsPerPage,
      },
    };
    return cli.get(`/challenges/${challengeId}/participants`, params);
  }

  getParticipations(
    challengeId: number,
    participantId: number
  ): Promise<AxiosResponse<GetShooterParticipationsResponse>> {
    return cli.get(`/challenges/${challengeId}/participants/${participantId}/participations`);
  }

  createChallenge(
    name: string,
    address: CreateAddressRequest,
    startDate: Date,
    organiserClubId: number,
    categoryIds: number[],
    disciplineIds: number[]
  ): Promise<AxiosResponse<CreateChallengeResponse>> {
    const payload = {
      name: name,
      address: address,
      startDate: formatDate(startDate, dateTheme.format.dateTimeServer),
      organiserClubId: organiserClubId,
      categoryIds: categoryIds,
      disciplineIds: disciplineIds,
    };
    return cli.post('/challenges', payload, {});
  }

  createParticipations(
    challengeId: number,
    participations: CreateParticipationsRequest
  ): Promise<AxiosResponse<void>> {
    return cli.post(`/challenges/${challengeId}/participations`, participations);
  }
}

export default new ChallengeService();
