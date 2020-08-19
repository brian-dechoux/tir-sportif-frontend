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
import AddIcon from '@material-ui/icons/Add';
import InfoIcon from '@material-ui/icons/Info';

type ChallengeDisciplineParticipationProps = {
  challengeId: number;
  disciplines: GetDisciplineResponse[];
  callbackShooterFn: () => Promise<number>,
  shooterFirstname: string,
  shooterLastname: string,
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
    resetShooter: () => any
  };
};

type DisciplineParticipation = {
  definition: GetDisciplineResponse;
  alreadyRanked: boolean;
}

const disciplineToDisciplineParticipation = (discipline: GetDisciplineResponse, participations: Participation[]): DisciplineParticipation => ({
  definition: discipline,
  alreadyRanked: participations.some(participation => participation.discipline === discipline.label && !participation.outrank)
});

const ChallengeDisciplineParticipation = (props: ChallengeDisciplineParticipationProps) => {
  const [formSent, setFormSent] = useState(false);

  const [participations, setParticipations] = useState<Participation[]>([]);
  const [disciplineParticipations, setDisciplineParticipations] = useState<DisciplineParticipation[]>(
    props.disciplines.map(discipline => disciplineToDisciplineParticipation(discipline, participations))
  );

  useEffect(() => {
    if (formSent) {
      const participationsPayload: CreateDisciplineParticipationRequest[] = participations.map(
        participation => ({
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
          props.actions.openToast('Le tireur a été inscrit au challenge', 'success');
          props.actions.push(`${ROUTES.CHALLENGE.LIST}/${props.challengeId}`);
          props.actions.resetShooter();
        } else {
          throw new Error();
        }
      }).catch(() => {
        props.actions.error("Impossible d'inscrire le tireur");
        setFormSent(false);
      });
    }
  }, [formSent]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const disciplinesFormValid = participations.length > 0;

  const handleParticipationDialogValidation = (newParticipation: Participation) => {
    if (newParticipation.discipline) {
      const updatedParticipations = [...participations, newParticipation];
      setParticipations(updatedParticipations);
      setDisciplineParticipations(props.disciplines.map(discipline => disciplineToDisciplineParticipation(discipline, updatedParticipations)));
    }
  };

  const handleParticipationDialogClose = () => {
    setDialogOpen(false);
  }

  const handleCancel = () => {
    props.actions.push(`${ROUTES.CHALLENGE.LIST}/${props.challengeId}`);
    props.actions.resetShooter();
  }

  const dialog = dialogOpen ?
    <ChallengeDisciplineParticipationDialog
      disciplines={disciplineParticipations}
      callbackValidateFn={handleParticipationDialogValidation}
      callbackCloseFn={handleParticipationDialogClose}
      actions={props.actions}
    /> : null;

  if (props.disciplines.length === 0) {
    return null;
  } else {
    return (<>
      {dialog}
      <Box display="flex" justifyContent="center" pt={2}>
        <Box display="flex" flexDirection="column" width={0.8}>
          <Box display="flex" justifyContent="center">
            <Typography variant="h6">
              {`${props.shooterFirstname} ${props.shooterLastname}`.toUpperCase()}: INSCRIPTION AUX DISCIPLINES
            </Typography>
          </Box>
          <Box pb={2} pt={4}>
            <Button
              disabled={props.disciplines.length === 0}
              variant="contained"
              color="secondary"
              onClick={() => setDialogOpen(true)}
              startIcon={<AddIcon />}
            >
              AJOUTER
            </Button>
          </Box>
          {
            props.disciplines.length === disciplineParticipations.filter(disciplineParticipation => disciplineParticipation.alreadyRanked).length ?
              <Box
                display="flex"
                fontStyle="italic"
                alignItems="center"
                pb={2}
              >
                <InfoIcon color="secondary" />
                <Typography variant="body2">
                  Le tireur est inscrit et classé à toutes les disciplines proposées par le challenge
                </Typography>
              </Box>
              : null
          }

          <Box pb={2}>
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
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <Box pr={1}>
              <Button
                variant="outlined"
                onClick={handleCancel}
              >
                ANNULER
              </Button>
            </Box>
            <Button
              disabled={!disciplinesFormValid}
              variant="contained"
              color="secondary"
              type="button"
              onClick={() => setFormSent(true)}
            >
              VALIDER L'INSCRIPTION
            </Button>
          </Box>
        </Box>
      </Box>
    </>);
  }
};

export default ChallengeDisciplineParticipation;
