import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ROUTES } from 'configurations/server.configuration';
import { booleanToText } from 'configurations/theme.configuration';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import { ToastVariant } from 'components/toast/toast';
import TableContainer from '@material-ui/core/TableContainer';
import {
  CreateDisciplineParticipationRequest,
  CreateParticipationsRequest,
  Participation,
} from 'services/models/challenge.model';
import ChallengeService from 'services/challenge.service';
import ChallengeDisciplineParticipationDialog from './challenge-discipline-participation-dialog';

type ChallengeDisciplineParticipationProps = {
  challengeId: number;
  disciplines: GetDisciplineResponse[];
  callbackShooterFn: () => Promise<number>
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ChallengeDisciplineParticipation = (props: ChallengeDisciplineParticipationProps) => {
  const [formSent, setFormSent] = useState(false);

  const [availableDisciplines, setAvailableDisciplines] = useState(props.disciplines);
  const [participations, setParticipations] = useState<Participation[]>([]);

  useEffect(() => {
    if (formSent) {
      const participationsPayload: CreateDisciplineParticipationRequest[] = participations.map(
        participation => ({
          // FIXME -1 -> Select properly
          disciplineId: props.disciplines.find(discipline => discipline.label === participation.discipline)?.id ?? -1,
          useElectronicTarget: participation.useElectronicTarget,
          paid: participation.paid,
          outrank: participation.outrank,
        }));
      props.callbackShooterFn().then(shooterId => {
        const createParticipationsPayload: CreateParticipationsRequest = {
          shooterId: shooterId,
          disciplinesInformation: participationsPayload,
        };
        return ChallengeService.createParticipations(
          props.challengeId,
          createParticipationsPayload
        )
      }).then(response => {
        if (response.status === 201) {
          props.actions.openToast('La tireur a été inscrit au challenge', 'success');
          props.actions.push(`${ROUTES.CHALLENGE.LIST}/${props.challengeId}`);
        } else {
          throw new Error();
        }
      }).catch(() => {
        // TODO Reset full form in case of error
        // FIXME one route for participation + create ?
        props.actions.error("Impossible d'inscrire le tireur");
        setFormSent(false);
      });
    }
  }, [formSent]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const disciplinesFormValid = participations.length > 0;

  // FIXME revoir availableDiscipline....
  //  Ils devraient toujours etre dispo, mais avec un outrank lock si deja un ranked
  const handleParticipationDialogValidation = (newParticipation: Participation) => {
    if (newParticipation.discipline) {
      setParticipations([...participations, newParticipation]);
      if (!newParticipation.outrank) {
        setAvailableDisciplines(
          availableDisciplines.filter(
            availableDiscipline => availableDiscipline.label !== newParticipation.discipline
          )
        );
      }
    }
  };

  const handleParticipationDialogClose = () => {
    setDialogOpen(false);
  }

  const dialog = dialogOpen ?
    <ChallengeDisciplineParticipationDialog
      disciplines={props.disciplines}
      callbackValidateFn={handleParticipationDialogValidation}
      callbackCloseFn={handleParticipationDialogClose}
      actions={props.actions}
    /> : null;

  if (props.disciplines.length === 0) {
    // TODO spinner (with message ?)
    return null;
  } else {
    return (<>
      {dialog}
      <Box display="flex" justifyContent="center" pt={2}>
        <Box display="flex" width={0.6}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h6">
                AJOUTER LES DISCIPLINES À L'INSCRIPTION DU TIREUR
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button
                disabled={availableDisciplines.length === 0}
                variant="contained"
                color="secondary"
                onClick={() => setDialogOpen(true)}
              >
                AJOUTER
              </Button>

            </Grid>
            <Grid item xs={10}>
              <Box fontStyle="italic">
                <Typography variant="body2" hidden={availableDisciplines.length > 0}>
                  * Le tireur est inscrit et classé à toutes les disciplines proposées par le challenge
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table stickyHeader>
                  <colgroup>
                    <col width={0.3} />
                    <col width={0.2} />
                    <col width={0.2} />
                    <col width={0.2} />
                    <col width={0.1} />
                  </colgroup>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">DISCIPLINE</TableCell>
                      <TableCell align="center">CIBLE ÉLECTRONIQUE</TableCell>
                      <TableCell align="center">HORS CLASSEMENT</TableCell>
                      <TableCell align="center">A PAYÉ</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {participations.map(participation => (
                      <TableRow key={participation.discipline}>
                        <TableCell align="center">{participation.discipline}</TableCell>
                        <TableCell align="center">
                          {booleanToText(participation.useElectronicTarget)}
                        </TableCell>
                        <TableCell align="center">
                          {booleanToText(participation.outrank)}
                        </TableCell>
                        <TableCell align="center">
                          {booleanToText(participation.paid)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item container spacing={2} justify="flex-end" alignItems="center">
              <Grid item>
                <Button
                  variant="outlined"
                  component={Link}
                  to={`${ROUTES.CHALLENGE.LIST}/${props.challengeId}`}
                >
                  ANNULER
                </Button>
              </Grid>
              <Grid>
                <Button
                  disabled={!disciplinesFormValid}
                  variant="contained"
                  color="secondary"
                  type="button"
                  onClick={() => setFormSent(true)}
                >
                  VALIDER L'INSCRIPTION
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>);
  }
};

export default ChallengeDisciplineParticipation;
