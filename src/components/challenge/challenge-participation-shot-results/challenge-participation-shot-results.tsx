import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Grid,
  Input,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ERRORS, ROUTES } from 'configurations/server.configuration';
import TableContainer from '@material-ui/core/TableContainer';
import { GetShooterResponse } from 'services/models/shooter.model';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import ChallengeService from 'services/challenge.service';
import {
  GetParticipationResultsResponse,
  GetParticipationSerieResultsResponse,
} from 'services/models/challenge.model';
import ShooterService from 'services/shooter.service';
import debounce from 'utils/debounce.utils';
import DeleteIcon from '@material-ui/icons/Delete';
import { ToastVariant } from '../../toast/toast';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ActionValidationDialog, { DialogType } from '../../dialog/action-validation-dialog';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import InfoIcon from '@material-ui/icons/Info';
import { debounceDefaultValue } from 'configurations/theme.configuration';

type ShotResultAdded = {
  eventTarget: any;
  serieNb: number;
  shotNb: number | null;
  points: number;
}

type ChallengeParticipationShotResultsProps = {
  challengeId: number;
  shooterId: number;
  participationId: number;
  discipline: GetDisciplineResponse;
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ChallengeParticipationShotResults = (props: ChallengeParticipationShotResultsProps) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const [participationDeleted, setParticipationDeleted] = useState(false);
  const [shotResultAdded, setShotResultAdded] = useState<ShotResultAdded>();
  const [shooter, setShooter] = useState<GetShooterResponse>();
  const [participationResults, setParticipationResults] = useState<GetParticipationResultsResponse>();
  const [lastPointValue, setLastPointValue] = useState<number>();

  const handleInputClick = (points: number) => {
    setLastPointValue(points);
  }

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
    Promise.all([
      ShooterService.getShooter(props.shooterId),
      ChallengeService.getParticipationShotResults(props.challengeId, props.participationId)
    ]).then(([shooterResponse, shotResultsResponse]) => {
        if (!unmounted) {
          setShooter(shooterResponse.data);
          setParticipationResults(shotResultsResponse.data);
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

  useEffect(() => {
    if (shotResultAdded) {
      ChallengeService.addShotResult(
        props.challengeId,
        props.participationId,
        shotResultAdded.serieNb,
        shotResultAdded.shotNb,
        shotResultAdded.points
      ).then((shotResultsResponse) => {
          setParticipationResults(shotResultsResponse.data);
        })
        .catch(errorResponse => {
          props.actions.error(errorResponse.response.data.message);
          shotResultAdded.eventTarget.value = lastPointValue ? lastPointValue.toString(10) : '';
        });
    }
  }, [shotResultAdded]);

  // TODO use effect for async action
  let debounceFn: any;
  const addShotResult = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, serieNb: number, shotNb: number | null) => {
    event.persist();
    if (!debounceFn) {
      debounceFn = debounce((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, serieNb: number, shotNb: number | null) => {
        let target = event.target;
        if (target.value) {
          const points: number = parseFloat(target.value);
          setShotResultAdded({
            eventTarget: target, serieNb: serieNb, shotNb: shotNb, points: points
          })
        }
      }, debounceDefaultValue);
    }
    debounceFn(event, serieNb, shotNb);
  }

  const displayTable = (participationResults: GetParticipationResultsResponse, discipline: GetDisciplineResponse) => {
    const headRowShotCells = [];
    for (let i = 1; i <= discipline.nbShotsPerSerie; i++) {
      headRowShotCells.push(<TableCell align="center" key={`header${i}`}>TIR {i}</TableCell>)
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
                          <TableCell align="center" key={`result${participationResultSerieIndex}${participationResultShotIndex}`}>
                            <Input
                              type="number"
                              inputProps = {{ step: discipline.useDecimalResults ? 0.1 : 1 }}
                              onClick={() => handleInputClick(participationResultSerieShotPoints)}
                              onChange={(e) => addShotResult(
                                e,
                                participationResultSerieIndex,
                                participationResultShotIndex === serieResult.points.length ? -1 : participationResultShotIndex
                              )}
                              defaultValue={participationResultSerieShotPoints}
                            />
                          </TableCell>
                        )})}
                      {/*https://github.com/mui-org/material-ui/issues/1328#issuecomment-198087347*/}
                      <TableCell align="center" key={`serieTotal${participationResultSerieIndex}${serieResult.manualTotal ? serieResult.manualTotal : serieResult.calculatedTotal}`}>
                        <Input
                          type="number"
                          inputProps = {{ step: discipline.useDecimalResults ? 0.1 : 1 }}
                          onChange={(e) => addShotResult(
                            e,
                            participationResultSerieIndex,
                            null
                          )}
                          defaultValue={serieResult.manualTotal ? serieResult.manualTotal : serieResult.calculatedTotal}
                          startAdornment={serieResult.manualTotal ?
                              <InputAdornment position="start">
                                <Tooltip title="Valeur manuelle" placement="top" arrow>
                                  <InfoIcon color="secondary" fontSize="small"/>
                                </Tooltip>
                              </InputAdornment> : null
                          }
                          endAdornment={serieResult.manualTotal && serieResult.manualTotal !== serieResult.calculatedTotal ?
                            <InputAdornment position="start">
                              <Tooltip title={`Somme automatique: ${serieResult.calculatedTotal}`} placement="top" arrow>
                                <PriorityHighIcon color="secondary" />
                              </Tooltip>
                            </InputAdornment> : null
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                <TableRow key="participationTotal">
                  <TableCell colSpan={participationResults.participationReference.nbShotsPerSerie}>
                    <Typography variant="body1">Nombre total de points pour cette participation</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6">
                      {
                        participationResults.participationTotal
                      }
                    </Typography>
                  </TableCell>
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

  if (!(shooter && participationResults)) {
    return null;
  } else {
    const resultsBlock = displayTable(participationResults, props.discipline)
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
            <Box>
              <Button
                variant="contained"
                color="secondary"
                type="button"
                onClick={() => setDialogOpen(true)}
                startIcon={<DeleteIcon />}
              >
                SUPPRIMER LA PARTICIPATION
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
                  {props.discipline.label}, {participationResults.participationReference.useElectronicTarget ? 'sur cible électronique' : 'sur cible traditionnelle'}
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
