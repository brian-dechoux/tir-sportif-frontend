import React, { useEffect, useState } from 'react';
import { ToastVariant } from '../../toast/toast';
import { Box, Button } from '@material-ui/core';
import ClubService from 'services/club.service';
import CategoryService from 'services/category.service';
import DisciplineService from 'services/discipline.service';
import { ROUTES } from 'configurations/server.configuration';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { GetClubResponse } from 'services/models/club.model';
import { GetCategoryResponse } from 'services/models/category.model';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import AddShooterContainer from '../../shooter/add-shooter.container';
import MyClubLicenseeCreationSpecificInfosContainer
  from './licensee-creation-specific-infos/my-club-licensee-creation-specific-infos.container';

type MyClubLicenseeCreationProps = {
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


const MyClubLicenseeCreation = (props: MyClubLicenseeCreationProps) => {

  const [myclub, setMyClub] = useState<GetClubResponse>();
  const [categories, setCategories] = useState<GetCategoryResponse[]>([]);
  const [disciplines, setDisciplines] = useState<GetDisciplineResponse[]>([]);

  useEffect(() => {
    let unmounted = false;
    Promise.all([
      ClubService.getMyClub(),
      CategoryService.getCategories(),
      DisciplineService.getDisciplines()
    ]).then(([myclubResponse, categoriesResponse, disciplinesResponse]) => {
        if (!unmounted) {
          setMyClub(myclubResponse.data);
          setCategories(categoriesResponse.data);
          setDisciplines(disciplinesResponse.data);
        }
      })
      .catch(() => {
        props.actions.error(
          "Impossible de récupérer mon club"
        );
      });
    return () => {
      unmounted = true;
    };
  }, []);

  if (!myclub || categories.length === 0 || disciplines.length === 0) {
    return null;
  } else {
    if (!props.shooterResolved) {
      return (
        <AddShooterContainer
          clubs={[myclub]}
          filteredCategories={categories}
          filteredDisciplines={disciplines}
          backRoute={ROUTES.MYCLUB.LICENSEES.LIST}
        />
      );
    } else {
      return (
        <form noValidate>
          <Box display="flex" width={1}>
            <Button
              variant="outlined"
              onClick={props.actions.resetShooter}
              startIcon={<KeyboardBackspaceIcon/>}
            >
              RETOUR
            </Button>
          </Box>
          <MyClubLicenseeCreationSpecificInfosContainer />
        </form>
      );
    }
  }
};

export default MyClubLicenseeCreation;
