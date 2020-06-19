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
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  CreateParticipationsRequest,
  GetParticipationResponse,
  GetShooterParticipationsResponse,
  Participation,
} from 'services/models/challenge.model';
import ChallengeService from 'services/challenge.service';
import { Link } from 'react-router-dom';
import { ROUTES } from 'configurations/server.configuration';
import TableContainer from '@material-ui/core/TableContainer';
import { NA } from 'App.constants';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import { ToastVariant } from '../../toast/toast';
import ChallengeDisciplineParticipationDialog, { DisciplineParticipation } from '../challenge-discipline-participation/challenge-discipline-participation-dialog';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

type ChallengeShooterProps = {
  challengeId: number;
  shooterId: number;
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const disciplineToDisciplineParticipation = (discipline: GetDisciplineResponse, participations: GetParticipationResponse[]) => ({
  definition: discipline,
  alreadyRanked: participations.some(participation => participation.discipline.id === discipline.id && !participation.outrank)
})

const ChallengeShooter = (props: ChallengeShooterProps) => {
  const useStyles = makeStyles(theme => ({
    divider: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(2),
    },
    button: {
      margin: theme.spacing(1),
    },
    tableRow: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }));
  const classes = useStyles();

  const [shooterParticipations, setShooterParticipations] = useState<GetShooterParticipationsResponse>();
  const [disciplines, setDisciplines] = useState<GetDisciplineResponse[]>([]);
  const [disciplineParticipations, setDisciplineParticipations] = useState<DisciplineParticipation[]>([]);

  useEffect(() => {
    let unmounted = false;
    Promise.all([
      ChallengeService.getChallenge(props.challengeId),
      ChallengeService.getParticipations(props.challengeId, props.shooterId)
    ])
      .then(([challengeResponse, participationsResponse]) => {
        if (!unmounted) {
          setShooterParticipations(participationsResponse.data);
          setDisciplines(challengeResponse.data.disciplines);
          setDisciplineParticipations(challengeResponse.data.disciplines.map(discipline => disciplineToDisciplineParticipation(discipline, participationsResponse.data.participations)))
        }
      })
      .catch(() => {
        if (!unmounted) {
          props.actions.error('Impossible de récupérer les informations du tireur inscrit au challenge');
        }
      });
    return () => {
      unmounted = true;
    };
  }, []);

  const participationsBlock =
    (shooterParticipations?.participations?.length ?? 0) > 0 ? (
      <TableContainer component={Paper}>
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
              <TableRow
                className={classes.tableRow}
                key={participation.id}
                hover
                onClick={() => props.actions.push(`${ROUTES.CHALLENGE.LIST}/${props.challengeId}${ROUTES.CHALLENGE.SHOOTER.LIST}/${props.shooterId}${ROUTES.CHALLENGE.SHOOTER.SHOT_RESULTS.LIST}/${participation.discipline.id}/${participation.id}`)}
              >
                <TableCell align="center">{participation.discipline.label}</TableCell>
                <TableCell align="center">{participation.useElectronicTarget ? 'Oui' : 'Non'}</TableCell>
                <TableCell align="center">{participation.outrank ? 'Oui' : 'Non'}</TableCell>
                <TableCell align="center">{participation.paid ? 'Oui' : 'Non'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Typography variant="body1">Aucune participation enregistrée pour le moment</Typography>
    );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newParticipation, setNewParticipation] = useState<Participation>();

  useEffect(() => {
    if (newParticipation) {
      const createParticipationsPayload: CreateParticipationsRequest = {
        shooterId: props.shooterId,
        disciplinesInformation: [{
          disciplineId: disciplines.find(discipline => discipline.label === newParticipation.discipline)?.id ?? -1,
          useElectronicTarget: newParticipation.useElectronicTarget,
          paid: newParticipation.paid,
          outrank: newParticipation.outrank,
        }],
      };
      ChallengeService.createParticipations(
        props.challengeId,
        createParticipationsPayload
      ).then(response => {
        if (response.status === 201) {
          // TODO refresh here ! backend should return created data in order to have the generated ID
          props.actions.openToast('La participation a été ajoutée pour le tireur', 'success');
          setShooterParticipations(response.data);
          setDisciplineParticipations(disciplines.map(discipline => disciplineToDisciplineParticipation(discipline, response.data.participations)))
        }
      }).catch(() => {
        props.actions.error("Impossible d'ajouter une participation pour ce tireur");
      });
    }
  }, [newParticipation]);

  const handleParticipationDialogOpening = () => {
    setDialogOpen(true);
    setNewParticipation(undefined);
  }

  const handleParticipationDialogValidation = (newParticipation: Participation) => {
    setNewParticipation(newParticipation);
    setDialogOpen(false);
  }

  const handleParticipationDialogClose = () => {
    setDialogOpen(false);
  }

  const dialog = dialogOpen ?
    <ChallengeDisciplineParticipationDialog
      disciplines={disciplineParticipations}
      callbackValidateFn={handleParticipationDialogValidation}
      callbackCloseFn={handleParticipationDialogClose}
      actions={props.actions}
    /> : null;

  if (!shooterParticipations) {
    // TODO spinner (with message?)
    return null;
  } else {
    return (
      <>
        {dialog}
        <Box display="flex" width={1}>
          <Box flexGrow={1}>
            <Button variant="outlined" component={Link} to={`${ROUTES.CHALLENGE.LIST}/${props.challengeId}`}>
              RETOUR
            </Button>
          </Box>
          <Box display="flex">
            <Box pr={1}>
              <Button variant="contained" color="secondary" type="button" startIcon={<EditIcon />}>
                ÉDITER
              </Button>
            </Box>
            <Box>
              <Button variant="contained" color="secondary" type="button" startIcon={<RemoveCircleIcon />}>
                DÉSINSCRIRE
              </Button>
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" pb={1}>
          <Box width={0.6}>
            <Grid container direction="column" alignItems="center">
              <Grid item xs={12}>
                <Typography
                  variant="h6">{shooterParticipations?.shooter.firstname} {shooterParticipations?.shooter.lastname}</Typography>
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
        <Divider/>
        <Box pt={2}>
          <Box display="flex" width={1}>
            <Box flexGrow={1}>
              <Typography variant="h6">Participations enregistrées</Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleParticipationDialogOpening()}
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
