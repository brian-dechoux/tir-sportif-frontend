import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  GetChallengeResponse,
  GetParticipantResponse,
  GetParticipationResponse, GetShooterParticipationsResponse,
} from 'services/models/challenge.model';
import ChallengeService from 'services/challenge.service';
import { formatString } from 'utils/date.utils';
import { Link } from 'react-router-dom';
import { ROUTES } from 'configurations/server.configuration';
import { EMPTY_PAGE, Page } from 'services/models/page.model';
import TableContainer from '@material-ui/core/TableContainer';
import { customColors, paginationTheme } from 'configurations/theme.configuration';
import { NA } from '../../../App.constants';

type ChallengeShooterProps = {
  challengeId: number;
  shooterId: number;
  actions: {
    error: (message: string) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ChallengeShooter = (props: ChallengeShooterProps) => {
  const useStyles = makeStyles(theme => ({
    divider: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(2),
    },
    deleteButton: {
      backgroundColor: customColors.red,
      color: customColors.white,
    },
    tableRow: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }));
  const classes = useStyles();

  const [shooterParticipations, setShooterParticipations] = useState<GetShooterParticipationsResponse | null>(null);

  useEffect(() => {
    let unmounted = false;
    if (!shooterParticipations) {
      ChallengeService.getParticipations(props.challengeId, props.shooterId)
        .then(participationsResponse => {
          if (!unmounted) {
            setShooterParticipations(participationsResponse.data);
          }
        })
        .catch(() => {
          if (!unmounted) {
            props.actions.error('Impossible de récupérer les informations du tireur inscrit au challenge');
          }
        });
    }
    return () => {
      unmounted = true;
    };
  }, [shooterParticipations]);

  const participationsBlock =
    (<TableContainer component={Paper}>
      <Table stickyHeader>
        <colgroup>
          <col width={0.4} />
          <col width={0.2} />
          <col width={0.2} />
          <col width={0.2} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell align="center">DISCIPLINE</TableCell>
            <TableCell align="center">CIBLE ÉLECTRONIQUE</TableCell>
            <TableCell align="center">HORS CLASSEMENT</TableCell>
            <TableCell align="center">A PAYÉ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shooterParticipations?.participations?.map(participation => (
            <TableRow key={participation.id}>
              <TableCell align="center">{participation.discipline.label}</TableCell>
              <TableCell align="center">{participation.useElectronicTarget ? 'Oui' : 'Non'}</TableCell>
              <TableCell align="center">{participation.outrank ? 'Oui' : 'Non'}</TableCell>
              <TableCell align="center">{participation.paid ? 'Oui' : 'Non'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>);

  if (!shooterParticipations) {
    // TODO spinner (with message?)
    return null;
  } else {
    return (
      <>
        <Box display="flex" width={1}>
          <Box flexGrow={1}>
            <Button variant="outlined" component={Link} to={`${ROUTES.CHALLENGE.LIST}/${props.challengeId}`}>
              RETOUR
            </Button>
          </Box>
          <Box display="flex">
            <Box pr={1}>
              <Button variant="contained" color="secondary" type="button">
                ÉDITER
              </Button>
            </Box>
            <Box>
              <Button variant="contained" type="button" className={classes.deleteButton}>
                DÉSINSCRIRE
              </Button>
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" pb={1}>
          <Box width={0.6}>
            <Grid container direction="column" alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h6">{shooterParticipations?.shooter.firstname} {shooterParticipations?.shooter.lastname}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Catégorie: {shooterParticipations?.shooter.category.label}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Club: {shooterParticipations?.shooter.club?.name ?? NA}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Divider />
        <Box pt={2}>
          <Box display="flex" width={1}>
            <Box flexGrow={1}>
              <Typography variant="h6">Participations enregistrées</Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="secondary"
              >
                AJOUTER UNE PARTICIPATION
              </Button>
            </Box>
          </Box>
          <Box pt={2} display="flex" width={1}>
            {participationsBlock}
          </Box>
        </Box>
      </>
    );
  }
};

export default ChallengeShooter;
