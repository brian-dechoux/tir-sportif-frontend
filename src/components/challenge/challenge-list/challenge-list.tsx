import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  OutlinedInput,
  Paper, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow,
} from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import { GetChallengeListElementResponse } from 'services/models/challenge.model';
import { ThunkAction } from 'redux-thunk';
import { AppState } from 'redux/reducers/combined.reducer';

type ChallengeListProps = {
  actions: {
    getChallenges: (page: number) => ThunkAction<void, AppState, undefined, any>
  },
  challenges: GetChallengeListElementResponse[],
  nbElementsOnPage: number,
  currentPageNumber: number,
  nbPages: number,
  nbTotalElements: number
}

const ChallengeList = (props: ChallengeListProps) =>  {
  const getChallenges  = props.actions.getChallenges;
  const currentPageNumber  = props.currentPageNumber;
  const nbChallenges  = props.challenges.length;

  useEffect(() => { getChallenges(currentPageNumber)}, [getChallenges, currentPageNumber, nbChallenges]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    getChallenges(newPage);
  };

  return (
    <>
      <Box>
        <Grid container justify="center">
          <Grid item md={2}/>
          <Grid  item md={8}>
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
                <Grid item md={6}/>
                <Grid item md={3}>
                  <Button
                    variant="outlined"
                  >
                    <AddIcon/>
                    CREER UN CHALLENGE
                  </Button>
                </Grid>
              </Grid>
              <Grid item>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="right">NOM</TableCell>
                        <TableCell align="right">DATE</TableCell>
                        <TableCell align="right">NB&nbsp;TIREURS</TableCell>
                        <TableCell align="right">LIEU</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.challenges.map(challenge => (
                        <TableRow key={challenge.name}>
                          <TableCell align="right">{challenge.name}</TableCell>
                          <TableCell align="right">{challenge.startDate}</TableCell>
                          <TableCell align="right">{challenge.city}</TableCell>
                          <TableCell align="right">{challenge.nbShooters}</TableCell>
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
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item>

              </Grid>
            </Grid>
          </Grid>
          <Grid item md={2}/>
        </Grid>
      </Box>
    </>
  );
};

export default ChallengeList;
