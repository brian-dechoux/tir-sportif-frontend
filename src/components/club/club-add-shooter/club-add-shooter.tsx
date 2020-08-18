import React, { useEffect, useState } from 'react';
import { ROUTES } from 'configurations/server.configuration';
import { GetClubResponse } from 'services/models/club.model';
import { GetCategoryResponse } from 'services/models/category.model';
import { ToastVariant } from 'components/toast/toast';
import { GetCountryResponse } from 'services/models/country.model';
import ClubService from 'services/club.service';
import AddShooterContainer from '../../shooter/add-shooter.container';

type ClubAddShooterProps = {
  clubId: number;
  countries: GetCountryResponse[];
  categories: GetCategoryResponse[];
  callbackShooterFn: () => Promise<number>;
  shooterResolved: boolean;
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
    resetShooter: () => any;
  };
};

const ClubAddShooter = (props: ClubAddShooterProps) => {
  const [clubs, setClubs] = useState<GetClubResponse[]>([]);

  useEffect(() => {
    let unmounted = false;
    if (clubs.length === 0) {
      Promise.all([
        ClubService.getClub(props.clubId),
      ])
        .then(([clubResponse]) => {
          if (!unmounted) {
            setClubs([clubResponse.data]);
          }
        })
        .catch(() => {
          if (!unmounted) {
            props.actions.error(
              "Impossible de récupérer les informations nécessaires à l'inscription d'un tireur pour le club"
            );
          }
        });
    }
    return () => {
      unmounted = true;
    };
  }, [clubs]);

  useEffect(() => {
    if (props.shooterResolved) {
      props.callbackShooterFn()
        .then((shooterId) =>
          ClubService.associateShooter(props.clubId, shooterId)
        ).then(() => {
          props.actions.openToast('Le tireur a été inscrit', 'success');
          props.actions.push(`${ROUTES.CLUBS.LIST}/${props.clubId}`);
          props.actions.resetShooter();
        }).catch(() => {
          props.actions.error("Impossible d'inscrire le tireur");
        });
    }
  })

  if (clubs.length === 0) {
    return null;
  } else {
    return (
      <AddShooterContainer
        clubs={clubs}
        filteredCategories={props.categories}
        backRoute={`${ROUTES.CLUBS.LIST}/${props.clubId}`}
        validateButtonLabel="VALIDER"
      />
    );
  }
}

export default ClubAddShooter;
