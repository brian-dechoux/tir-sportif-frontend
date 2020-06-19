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
import { GetChallengeResponse, GetParticipantResponse } from 'services/models/challenge.model';
import ChallengeService from 'services/challenge.service';
import { formatString } from 'utils/date.utils';
import { Link } from 'react-router-dom';
import { ROUTES } from 'configurations/server.configuration';
import { EMPTY_PAGE, Page } from 'services/models/page.model';
import TableContainer from '@material-ui/core/TableContainer';
import { paginationTheme } from 'configurations/theme.configuration';
import { NA } from '../../../App.constants';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import { ToastVariant } from '../../toast/toast';

type ChallengeDetailProps = {
  challengeId: number;
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ChallengeDetail = (props: ChallengeDetailProps) => {
  const useStyles = makeStyles(theme => ({
    divider: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(2),
    },
    tableRow: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }));
  const classes = useStyles();

  const [challengeDeleted, setChallengeDeleted] = useState(false);
  const [challengeInformation, setChallengeInformation] = useState<GetChallengeResponse>();
  const [pagedParticipants, setPagedParticipants] = useState<Page<GetParticipantResponse>>(
    EMPTY_PAGE()
  );

  useEffect(() => {
    if (challengeDeleted) {
      ChallengeService.deleteChallenge(props.challengeId)
        .then((response) => {
          if (response.status === 200) {
            props.actions.openToast('Challenge supprimé', 'success');
            props.actions.push(ROUTES.CHALLENGE.LIST);
          } else {
            throw new Error();
          }
        }).catch(() => {
          props.actions.error('Impossible de supprimer le challenge');
          setChallengeDeleted(false);
      })
    }
  }, [challengeDeleted]);

  useEffect(() => {
    let unmounted = false;
    ChallengeService.getChallenge(props.challengeId)
      .then(response => {
        if (!unmounted) {
          setChallengeInformation(response.data);
          handleChangePage(pagedParticipants.pageable.pageSize, 0);
        }
      })
      .catch(() => {
        if (!unmounted) {
          props.actions.error('Impossible de récupérer les informations du challenge demandé');
        }
      });
    return () => {
      unmounted = true;
    };
  }, []);

  const handleChangePage = (pageSize: number, pageNumber: number) => {
    ChallengeService.getParticipants(props.challengeId, pageSize, pageNumber)
      .then(response => {
        if (response.status === 200) {
          setPagedParticipants(response.data);
        }
      })
      .catch(() => {
        props.actions.error('Impossible de récupérer la liste des inscrits au challenge');
      });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPageValue: number = parseInt(event.target.value, 10);
    handleChangePage(newRowsPerPageValue, 0);
  };

  const shootersBlock =
    pagedParticipants.totalElements > 0 ? (
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
            {pagedParticipants.content.map(participant => (
              <TableRow key={participant.id}
                        className={classes.tableRow}
                        hover
                        onClick={() => props.actions.push(`${ROUTES.CHALLENGE.LIST}/${props.challengeId}${ROUTES.CHALLENGE.SHOOTER.LIST}/${participant.id}`)}
              >
                <TableCell align="center">{participant.lastname}</TableCell>
                <TableCell align="center">{participant.firstname}</TableCell>
                <TableCell align="center">{participant.clubName ?? NA}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={3}
                count={pagedParticipants.totalElements}
                rowsPerPage={pagedParticipants.pageable.pageSize}
                page={
                  pagedParticipants.pageable.pageNumber === -1
                    ? 0
                    : pagedParticipants.pageable.pageNumber
                }
                labelRowsPerPage={paginationTheme.rowsPerPage}
                labelDisplayedRows={paginationTheme.displayedRowsArgs}
                onChangePage={(event, pageNumber: number) =>
                  handleChangePage(pagedParticipants.pageable.pageSize, pageNumber)
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
            <Button
              variant="outlined"
              component={Link} to={ROUTES.CHALLENGE.LIST}
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
                onClick={() => setChallengeDeleted(true)}
                startIcon={<DeleteIcon />}
              >
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
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to={`${ROUTES.CHALLENGE.LIST}/${challengeInformation.id}${ROUTES.CHALLENGE.SHOOTER.CREATION}`}
                startIcon={<AddIcon />}
              >
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
