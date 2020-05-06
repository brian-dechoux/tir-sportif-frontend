import React, { useEffect, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { fr } from 'date-fns/locale';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Box, Button, Divider, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { GetChallengeResponse } from '../../../services/models/challenge.model';
import ChallengeService from 'services/challenge.service';
import { formatString } from '../../../utils/date.utils';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../configurations/server.configuration';

type ChallengeDetailProps = {
  challengeId: number;
  actions: {
    error: (message: string) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ChallengeDetail = (props: ChallengeDetailProps) => {
  const useStyles = makeStyles(() => ({
    withFlexGrow: {
      flex: 1,
    },
  }));
  const classes = useStyles();

  const [challengeInformation, setChallengeInformation] = useState<GetChallengeResponse>();

  useEffect(() => {
    let unmounted = false;
    if (!challengeInformation) {
      Promise.all([ChallengeService.getChallenge(props.challengeId)])
        .then(([challengeResponse]) => {
          if (!unmounted) {
            setChallengeInformation(challengeResponse.data);
          }
        })
        .catch(() => {
          if (!unmounted) {
            props.actions.error('Impossible de récupérer les informations du challenge demandé');
          }
        });
    }
    return () => {
      unmounted = true;
    };
  }, [challengeInformation]);

  // TODO
  // Use multiple sub components
  // InformationsGenerales fixed, InformationsGenerales edit => 2 composants
  if (!challengeInformation) {
    // TODO spinner (with message?)
    return null;
  } else {
    return (
      <>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fr}>
          <Box display="flex">
            <Grid container spacing={2} justify="flex-end" alignItems="center">
              <Grid item>
                <Button variant="outlined" component={Link} to={ROUTES.CHALLENGE.LIST}>
                  RETOUR
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                >
                  ÉDITER
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" justifyContent="center">
            <Box width={0.6}>
              <Grid container direction="column" alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="h6">
                    {challengeInformation.name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Se déroulera à {challengeInformation.address.city}, le {formatString(challengeInformation.startDate, "dd MMMM yyyy 'à' hh'h'mm")}
                  </Typography>
                </Grid>
              </Grid>
              <Divider/>
            </Box>
          </Box>
        </MuiPickersUtilsProvider>
      </>
    );
  }
};

export default ChallengeDetail;
