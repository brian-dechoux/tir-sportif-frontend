import React, { useEffect, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { fr } from 'date-fns/locale';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
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
import { GetChallengeWithParticipationsResponse, GetParticipationResponse } from 'services/models/challenge.model';
import ChallengeService from 'services/challenge.service';
import { formatString } from 'utils/date.utils';
import { Link } from 'react-router-dom';
import { ROUTES } from 'configurations/server.configuration';
import { EMPTY_PAGE, Page } from '../../../services/models/page.model';
import TableContainer from '@material-ui/core/TableContainer';
import { customColors, paginationTheme } from '../../../configurations/theme.configuration';

type ChallengeDetailProps = {
  challengeId: number;
  actions: {
    error: (message: string) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ChallengeDetail = (props: ChallengeDetailProps) => {
  const useStyles = makeStyles(theme => ({
    divider: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(2),
    },
    deleteButton: {
      backgroundColor: customColors.red,
      color: customColors.white,
    },
  }));
  const classes = useStyles();

  const [challengeInformation, setChallengeInformation] = useState<
    GetChallengeWithParticipationsResponse
  >();
  const [pagedParticipations, setPagedParticipations] = useState<Page<GetParticipationResponse>>(
    EMPTY_PAGE()
  );

  useEffect(() => {
    let unmounted = false;
    if (!challengeInformation) {
      ChallengeService.getChallenge(props.challengeId)
        .then(challengeResponse => {
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
  }, [challengeInformation, pagedParticipations]);

  const handleChangePage = (pageSize: number, pageNumber: number) => {
    ChallengeService.getParticipations(props.challengeId, pageSize, pageNumber)
      .then(response => {
        if (response.status === 200) {
          setPagedParticipations(response.data);
        }
      })
      .catch(() => {
        props.actions.error('Impossible de récupérer la liste des inscrits au challenge');
      });
  };

  // TODO useEffect ?
  if (pagedParticipations.pageable?.pageNumber === -1) {
    handleChangePage(pagedParticipations.pageable.pageSize, 0);
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPageValue: number = parseInt(event.target.value, 10);
    handleChangePage(newRowsPerPageValue, 0);
  };

  const shootersBlock =
    pagedParticipations.totalElements > 0 ? (
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <colgroup>
            <col width={0.3} />
            <col width={0.3} />
            <col width={0.4} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell align="center">NOM</TableCell>
              <TableCell align="center">PRENOM</TableCell>
              <TableCell align="center">CLUB</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedParticipations.content.map(participation => (
              <TableRow key={participation.id}>
                <TableCell align="center">{participation.shooter.lastname}</TableCell>
                <TableCell align="center">{participation.shooter.firstname}</TableCell>
                <TableCell align="center">{participation.shooter.club?.name ?? 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={3}
                count={pagedParticipations.totalElements}
                rowsPerPage={pagedParticipations.pageable.pageSize}
                page={
                  pagedParticipations.pageable.pageNumber === -1
                    ? 0
                    : pagedParticipations.pageable.pageNumber
                }
                labelRowsPerPage={paginationTheme.rowsPerPage}
                labelDisplayedRows={paginationTheme.displayedRowsArgs}
                onChangePage={(event, pageNumber: number) =>
                  handleChangePage(pagedParticipations.pageable.pageSize, pageNumber)
                }
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    ) : (
      <Typography variant="body1">Aucun tireur pour le moment</Typography>
    );

  // TODO
  // Use multiple sub components
  // InformationsGenerales fixed, InformationsGenerales edit => 2 composants
  if (!challengeInformation) {
    // TODO spinner (with message?)
    return null;
  } else {
    return (
      <>
        <Box display="flex" width={1}>
          <Box flexGrow={1}>
            <Button variant="outlined" component={Link} to={ROUTES.CHALLENGE.LIST}>
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
                SUPPRIMER
              </Button>
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" pb={1}>
          <Box width={0.6}>
            <Grid container direction="column" alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h6">{challengeInformation.name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Se déroulera à {challengeInformation.address.city}, le{' '}
                  {formatString(challengeInformation.startDate, "dd MMMM yyyy 'à' hh'h'mm")}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Divider />
        <Box pt={2}>
          <Box display="flex" width={1}>
            <Box flexGrow={1}>
              <Typography variant="h6">Tireurs inscrits</Typography>
            </Box>
            <Box>
              <Button variant="contained" color="secondary" component={Link} to={`${ROUTES.CHALLENGE.LIST}/${challengeInformation.id}${ROUTES.CHALLENGE.SHOOTER.CREATION}`}>
                INSCRIRE UN TIREUR
              </Button>
            </Box>
          </Box>
          <Box pt={2} display="flex" width={1}>
            {shootersBlock}
          </Box>
        </Box>
      </>
    );
  }
};

export default ChallengeDetail;
