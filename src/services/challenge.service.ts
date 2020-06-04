import {
  CreateChallengeResponse,
  CreateParticipationsRequest,
  GetChallengeListElementResponse,
  GetChallengeResponse,
  GetParticipantResponse,
  GetParticipationResultsResponse,
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

  createParticipations(
    challengeId: number,
    participations: CreateParticipationsRequest
  ): Promise<AxiosResponse<void>> {
    return cli.post(`/challenges/${challengeId}/participations`, participations);
  }

  getShooterShotResults(
    challengeId: number,
    participantId: number,
    disciplineId: number
  ): Promise<AxiosResponse<GetParticipationResultsResponse[]>> {
    return cli.get(`/challenges/${challengeId}/results/participants/${participantId}/disciplines/${disciplineId}`);
  }

  getParticipationShotResults(
    challengeId: number,
    participationId: number
  ): Promise<AxiosResponse<GetParticipationResultsResponse>> {
    return cli.get(`/challenges/${challengeId}/results/participations/${participationId}`);
  }
}

export default new ChallengeService();
