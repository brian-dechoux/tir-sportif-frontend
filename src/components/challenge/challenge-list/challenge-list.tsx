import React from 'react';
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  OutlinedInput,
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
import SearchIcon from '@material-ui/icons/Search';
import { GetChallengeListElementResponse } from 'services/models/challenge.model';
import { ThunkAction } from 'redux-thunk';
import { AppState } from 'redux/reducers/combined.reducer';

type ChallengeListProps = {
  actions: {
    changePage: (rowsPerPage: number, page: number) => ThunkAction<void, AppState, undefined, any>;
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
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    props.actions.changePage(props.nbElementsOnPage, newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPageValue: number = parseInt(event.target.value, 10);
    props.actions.changePage(newRowsPerPageValue, 0);
  };

  return (
    <>
      <Box>
        <Grid container justify="center">
          <Grid item md={2} />
          <Grid item md={8}>
            <Grid container justify="center" direction="column" spacing={3}>
              <Grid container item>
                <Grid item md={3}>
                  <OutlinedInput
                    id="outlined-adornment-weight"
                    labelWidth={0}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    }
                  />
                </Grid>
                <Grid item md={6} />
                <Grid item md={3}>
                  <Button variant="outlined">
                    <AddIcon />
                    CREER UN CHALLENGE
                  </Button>
                </Grid>
              </Grid>
              <Grid item>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">NOM</TableCell>
                        <TableCell align="center">DATE</TableCell>
                        <TableCell align="center">NB&nbsp;TIREURS</TableCell>
                        <TableCell align="center">LIEU</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.challenges.map(challenge => (
                        <TableRow key={challenge.id}>
                          <TableCell align="center">{challenge.name}</TableCell>
                          <TableCell align="center">{challenge.startDate}</TableCell>
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
                          onChangePage={handleChangePage}
                          onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item />
            </Grid>
          </Grid>
          <Grid item md={2} />
        </Grid>
      </Box>
    </>
  );
};

export default ChallengeList;