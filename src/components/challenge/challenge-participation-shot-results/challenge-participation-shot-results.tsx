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
import { Link } from 'react-router-dom';
import { ROUTES } from 'configurations/server.configuration';
import TableContainer from '@material-ui/core/TableContainer';
import { customColors } from 'configurations/theme.configuration';
import { GetShooterResponse } from 'services/models/shooter.model';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import DisciplineService from 'services/discipline.service';
import ChallengeService from 'services/challenge.service';
import { GetParticipationResultsResponse } from 'services/models/challenge.model';
import ShooterService from 'services/shooter.service';

type ChallengeParticipationShotResultsProps = {
  challengeId: number;
  shooterId: number;
  disciplineId: number;
  participationId: number;
  actions: {
    error: (message: string) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ChallengeParticipationShotResults = (props: ChallengeParticipationShotResultsProps) => {
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

  const [shooter, setShooter] = useState<GetShooterResponse>();
  const [discipline, setDiscipline] = useState<GetDisciplineResponse>();
  const [shotResults, setShotResults] = useState<GetParticipationResultsResponse>();

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
                {participationResults.points.map((participationResultSerie, participationResultSerieIndex) => (
                  <TableRow key={participationResultSerieIndex}>
                    {participationResultSerie.map((participationResultSerieShotPoints) => (
                      <TableCell align="center">{participationResultSerieShotPoints}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </>
    )
  }

  if (!(shooter && discipline && shotResults)) {
    return null;
  } else {
    const resultsBlock = displayTable(shotResults, discipline)
    return (
      <>
        <Box display="flex" width={1}>
          <Box flexGrow={1}>
            <Button variant="outlined" component={Link}
                    to={`${ROUTES.CHALLENGE.LIST}/${props.challengeId}${ROUTES.CHALLENGE.SHOOTER.LIST}/${props.shooterId}`}>
              RETOUR
            </Button>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" pb={1}>
          <Box width={0.6}>
            <Grid container direction="column" alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h6">{shooter.firstname} {shooter.lastname}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Résultats de tir pour la discipline: {discipline.label}
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
