import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Grid,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ERRORS, ROUTES } from 'configurations/server.configuration';
import TableContainer from '@material-ui/core/TableContainer';
import { GetShooterResponse } from 'services/models/shooter.model';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import DisciplineService from 'services/discipline.service';
import ChallengeService from 'services/challenge.service';
import { GetParticipationResultsResponse, GetParticipationSerieResultsResponse } from 'services/models/challenge.model';
import ShooterService from 'services/shooter.service';
import debounce from '../../../utils/debounce.utils';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { ToastVariant } from '../../toast/toast';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ActionValidationDialog, { DialogType } from '../../dialog/action-validation-dialog';

type ChallengeParticipationShotResultsProps = {
  challengeId: number;
  shooterId: number;
  disciplineId: number;
  participationId: number;
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ChallengeParticipationShotResults = (props: ChallengeParticipationShotResultsProps) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const [participationDeleted, setParticipationDeleted] = useState(false);
  const [shooter, setShooter] = useState<GetShooterResponse>();
  const [discipline, setDiscipline] = useState<GetDisciplineResponse>();
  const [shotResults, setShotResults] = useState<GetParticipationResultsResponse>();

  useEffect(() => {
    if (participationDeleted) {
      ChallengeService.deleteParticipation(props.challengeId, props.participationId)
        .then((response) => {
          if (response.status === 200) {
            props.actions.openToast('Participation supprimée', 'success');
            props.actions.push(`${ROUTES.CHALLENGE.LIST}/${props.challengeId}${ROUTES.CHALLENGE.SHOOTER.LIST}/${props.shooterId}`)
          } else {
            throw new Error();
          }
        }).catch((errorResponse) => {
          if (errorResponse.response.status === 403 && errorResponse.response.data.code === ERRORS.SHOT_RESULTS_SAVED_FOR_PARTICIPATION) {
            props.actions.error('Impossible de supprimer la participation: Des résultats de tir ont été sauvés');
          } else {
            props.actions.error('Impossible de supprimer la participation');
          }
          setParticipationDeleted(false);
        })
    }
  }, [participationDeleted]);

  useEffect(() => {
    let unmounted = false;
    // TODO it might be done in one call only
    Promise.all([
      ShooterService.getShooter(props.shooterId),
      DisciplineService.getDiscipline(props.disciplineId),
      ChallengeService.getParticipationShotResults(props.challengeId, props.participationId)
    ]).then(([shooterResponse, disciplineResponse, shotResultsResponse]) => {
        if (!unmounted) {
          setShooter(shooterResponse.data);
          setDiscipline(disciplineResponse.data);
          setShotResults(shotResultsResponse.data);
        }
      })
      .catch(() => {
        if (!unmounted) {
          props.actions.error('Impossible de récupérer les résultats de tir');
        }
      });
    return () => {
      unmounted = true;
    };
  }, []);

  // FIXME is this supposed to be state managed ?
  let debounceFn: any;
  const addShotResult = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, serieNb: number, shotNb: number | null) => {
    event.persist();
    if (!debounceFn) {
      debounceFn = debounce((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, serieNb: number, shotNb: number) => {
        let target = event.target;
        if (target.value) {
          const points: number = parseFloat(target.value);
          ChallengeService.addShotResult(props.challengeId, props.participationId, serieNb, shotNb, points)
            .catch(errorResponse => {
              props.actions.error(errorResponse.response.data.message);
              target.value = '';
            });
        }
      }, 300);
    }
    debounceFn(event, serieNb, shotNb);
  }

  const displayTable = (participationResults: GetParticipationResultsResponse, discipline: GetDisciplineResponse) => {
    const headRowShotCells = [];
    for (let i = 1; i <= discipline.nbShotsPerSerie; i++) {
      headRowShotCells.push(<TableCell align="center">TIR {i}</TableCell>)
    }
    return (
      <>
        <Box display="flex" width={1}>
          <Box flexGrow={1}>
            <Typography variant="h6">{participationResults.participationReference.outrank ? 'Hors classement' : 'Classé'}</Typography>
          </Box>
        </Box>
        <Box pt={2} display="flex" width={1}>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {headRowShotCells}
                  <TableCell align="center">TOTAL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {participationResults.serieResults.map((serieResult: GetParticipationSerieResultsResponse, participationResultSerieIndex: number) => (
                    <TableRow key={participationResultSerieIndex}>
                      {serieResult.points.map((participationResultSerieShotPoints: number, participationResultShotIndex: number) => {
                        return (
                          <TableCell align="center">
                            <Input
                              type="number"
                              inputProps = {{ step: discipline.useDecimalResults ? 0.1 : 1 }}
                              onChange={(e) => addShotResult(
                                e,
                                participationResultSerieIndex + 1,
                                participationResultShotIndex + 1 === serieResult.points.length ? -1 : participationResultShotIndex
                              )}
                              defaultValue={participationResultSerieShotPoints}
                            />
                          </TableCell>
                        )})}
                      <TableCell align="center">
                        <Input
                          type="number"
                          inputProps = {{ step: discipline.useDecimalResults ? 0.1 : 1 }}
                          onChange={(e) => addShotResult(
                            e,
                            participationResultSerieIndex + 1,
                            null
                          )}
                          defaultValue={serieResult.manualTotal ? serieResult.manualTotal : serieResult.calculatedTotal}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                <TableRow key="participationTotal">
                  <TableCell colSpan={participationResults.participationReference.nbShotsPerSerie}>
                    <Typography variant="body1">Nombre total de points pour cette participation</Typography>
                  </TableCell>
                  <TableCell align="center">0</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </>
    )
  }

  const dialog = dialogOpen ?
    <ActionValidationDialog
      dialogType={DialogType.WARNING}
      dialogTitle="Confirmation de suppression"
      dialogContentMessage="Confirmez-vous la suppression d'inscription pour cette discipline ?"
      callbackValidateFn={() => {
        setParticipationDeleted(true);
        setDialogOpen(false);
      }}
      callbackCloseFn={() => setDialogOpen(false)}
    /> : null;

  if (!(shooter && discipline && shotResults)) {
    return null;
  } else {
    const resultsBlock = displayTable(shotResults, discipline)
    return (
      <>
        <Box display="flex" width={1}>
          <Box flexGrow={1}>
            <Button
              variant="outlined"
              component={Link}
              to={`${ROUTES.CHALLENGE.LIST}/${props.challengeId}${ROUTES.CHALLENGE.SHOOTER.LIST}/${props.shooterId}`}
              startIcon={<KeyboardBackspaceIcon />}
            >
              RETOUR
            </Button>
          </Box>
          <Box display="flex">
            <Box pr={1}>
              <Button
                variant="contained"
                color="secondary"
                type="button"
                startIcon={<EditIcon />}
                disabled
              >
                ÉDITER
              </Button>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="secondary"
                type="button"
                onClick={() => setDialogOpen(true)}
                startIcon={<DeleteIcon />}
              >
                SUPPRIMER
              </Button>
              {dialog}
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" pb={1}>
          <Box width={0.6}>
            <Grid container direction="column" alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h6">{shooter.firstname} {shooter.lastname}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  {discipline.label}, {shotResults.participationReference.useElectronicTarget ? 'sur cible électronique' : 'sur cible traditionnelle'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Divider/>
        {resultsBlock}
      </>
    );
  }
}

export default ChallengeParticipationShotResults;
