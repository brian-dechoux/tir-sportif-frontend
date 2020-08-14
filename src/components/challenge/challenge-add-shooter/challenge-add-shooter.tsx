import React, { useEffect, useState } from 'react';
import { Box, Button } from '@material-ui/core';
import { ROUTES } from 'configurations/server.configuration';
import { GetClubResponse } from 'services/models/club.model';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import { GetCategoryResponse } from 'services/models/category.model';
import { ToastVariant } from 'components/toast/toast';
import { GetCountryResponse } from 'services/models/country.model';
import ChallengeService from 'services/challenge.service';
import ClubService from 'services/club.service';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import AddShooterContainer from '../../shooter/add-shooter.container';
import ChallengeDisciplineParticipationContainer
  from '../challenge-discipline-participation/challenge-discipline-participation.container';

type ChallengeAddShooterProps = {
  challengeId: number;
  countries: GetCountryResponse[];
  callbackShooterFn: () => Promise<number>;
  shooterFirstname: string;
  shooterLastname: string;
  shooterResolved: boolean;
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
    resetShooter: () => any;
  };
};

const ChallengeAddShooter = (props: ChallengeAddShooterProps) => {
  const [clubs, setClubs] = useState<GetClubResponse[]>([]);
  const [categories, setCategories] = useState<GetCategoryResponse[]>([]);
  const [disciplines, setDisciplines] = useState<GetDisciplineResponse[]>([]);

  useEffect(() => {
    let unmounted = false;
    if (clubs.length === 0 && categories.length === 0 && disciplines.length === 0) {
      Promise.all([
        ChallengeService.getChallenge(props.challengeId),
        ClubService.getClubs(),
      ])
        .then(([challengeResponse, clubsResponse]) => {
          if (!unmounted) {
            setClubs(clubsResponse.data);
            setCategories(challengeResponse.data.categories);
            setDisciplines(challengeResponse.data.disciplines);
          }
        })
        .catch(() => {
          if (!unmounted) {
            props.actions.error(
              "Impossible de récupérer les listes d'information nécessaires à l'inscription d'un tireur"
            );
          }
        });
    }
    return () => {
      unmounted = true;
    };
  }, [clubs, categories, disciplines]);

  if (clubs.length === 0 || categories.length === 0 || disciplines.length === 0) {
    return null;
  } else {
    if (!props.shooterResolved) {
      return (
        <AddShooterContainer
          clubs={clubs}
          filteredCategories={categories}
          backRoute={`${ROUTES.CHALLENGE.LIST}/${props.challengeId}`}
        />
      );
    } else {
      return (
        <form noValidate>
          <Box display="flex" width={1}>
            <Button
              variant="outlined"
              onClick={props.actions.resetShooter}
              startIcon={<KeyboardBackspaceIcon />}
            >
              RETOUR
            </Button>
          </Box>
          <ChallengeDisciplineParticipationContainer
            challengeId={props.challengeId}
            disciplines={disciplines}
          />
        </form>
      );
    }
  }
}



export default ChallengeAddShooter;
