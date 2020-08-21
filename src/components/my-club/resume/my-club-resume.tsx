import React, { useEffect, useState } from 'react';
import { ToastVariant } from '../../toast/toast';
import { Box, Typography } from '@material-ui/core';
import { GetClubResponse } from '../../../services/models/club.model';
import ClubService from '../../../services/club.service';

type MyClubResumeProps = {
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};


const MyClubResume = (props: MyClubResumeProps) => {
  const [myClub, setMyClub] = useState<GetClubResponse>();

  useEffect(() => {
    let unmounted = false;
    ClubService.getMyClub()
      .then((myClubResponse) => {
        if (!unmounted) {
          setMyClub(myClubResponse.data);
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

  return myClub ? (
    <Box display="flex" flexDirection="column" width={1} alignItems="center">
      <Typography variant="h6">
        {myClub.name}
      </Typography>
      <Typography>
        Basé à {myClub.address.city}, {myClub.address.number} {myClub.address.street}
      </Typography>
    </Box>
  ) : null;
};

export default MyClubResume;
