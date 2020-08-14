import React, { useEffect, useState } from 'react';
import { ToastVariant } from '../../toast/toast';
import { Box, Button } from '@material-ui/core';
import ClubService from 'services/club.service';
import { ROUTES } from 'configurations/server.configuration';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { GetClubResponse } from 'services/models/club.model';
import AddShooterContainer from '../../shooter/add-shooter.container';
import MyClubLicenseeCreationSpecificInfosContainer
  from './licensee-creation-specific-infos/my-club-licensee-creation-specific-infos.container';
import { GetCategoryResponse } from 'services/models/category.model';

type MyClubLicenseeCreationProps = {
  categories: GetCategoryResponse[];
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

  useEffect(() => {
    let unmounted = false;
    ClubService.getMyClub()
      .then((myclubResponse) => {
        if (!unmounted) {
          setMyClub(myclubResponse.data);
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

  if (!myclub) {
    return null;
  } else {
    if (!props.shooterResolved) {
      return (
        <AddShooterContainer
          clubs={[myclub]}
          filteredCategories={props.categories}
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
