import React from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import AddIcon from '@material-ui/icons/Add';
import { GetChallengeListElementResponse } from 'services/models/challenge.model';
import { ThunkAction } from 'redux-thunk';
import { AppState } from 'redux/reducers/combined.reducer';
import { ROUTES } from 'configurations/server.configuration';
import { CallHistoryMethodAction } from 'connected-react-router';
import { makeStyles } from '@material-ui/core/styles';
import { LabelDisplayedRowsArgs } from '@material-ui/core/TablePagination/TablePagination';
import moment from 'moment';
import 'moment/locale/fr';

type ChallengeListProps = {
  actions: {
    changePage: (rowsPerPage: number, page: number) => ThunkAction<void, AppState, undefined, any>;
    push: (
      path: string,
      state?: any | undefined
    ) => CallHistoryMethodAction<[string, (any | undefined)?]>;
  };
  challenges: GetChallengeListElementResponse[];
  nbElementsOnPage: number;
  currentPageNumber: number;
  nbPages: number;
  nbTotalElements: number;
};

// TODO Add CSS for table:
//  - cells align=center
const ChallengeList = (props: ChallengeListProps) => {
  const useStyles = makeStyles(() => ({
    columnChallengeName: {
      width: '30%',
    },
    columnChallengeDate: {
      width: '20%',
    },
    columnChallengeShooterNb: {
      width: '20%',
    },
    columnChallengeLocation: {
      width: '30%',
    },
  }));
  const classes = useStyles();

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    props.actions.changePage(props.nbElementsOnPage, newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPageValue: number = parseInt(event.target.value, 10);
    props.actions.changePage(newRowsPerPageValue, 0);
  };

  const handleClickOnCreateChallengeButton = () => {
    props.actions.push(ROUTES.CHALLENGE.CREATION);
  };

  const labelRowsPerPage = "Nombre d'éléments par page";
  const labelDisplayedRowsArgs = (paginationInfo: LabelDisplayedRowsArgs) =>
    `Element ${paginationInfo.from} à ${paginationInfo.to}, sur un total de: ${paginationInfo.count}`;

  return (
    <>
      <Grid container direction="column" justify="center" spacing={2}>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClickOnCreateChallengeButton}
          >
            <AddIcon />
            CREER UN CHALLENGE
          </Button>
        </Grid>
        <Grid item>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <colgroup>
                <col className={classes.columnChallengeName} />
                <col className={classes.columnChallengeDate} />
                <col className={classes.columnChallengeShooterNb} />
                <col className={classes.columnChallengeLocation} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center">NOM</TableCell>
                  <TableCell align="center">DATE ET HEURE</TableCell>
                  <TableCell align="center">NOMBRE DE TIREURS</TableCell>
                  <TableCell align="center">LIEU</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.challenges.map(challenge => (
                  <TableRow key={challenge.id}>
                    <TableCell align="center">{challenge.name}</TableCell>
                    <TableCell align="center">{moment(challenge.startDate).format('Do MMMM YYYY, hh:mm:ss')}</TableCell>
                    <TableCell align="center">{challenge.nbShooters}</TableCell>
                    <TableCell align="center">{challenge.city}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={3}
                    count={props.nbTotalElements}
                    rowsPerPage={props.nbElementsOnPage}
                    page={props.currentPageNumber}
                    labelRowsPerPage={labelRowsPerPage}
                    labelDisplayedRows={labelDisplayedRowsArgs}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default ChallengeList;
