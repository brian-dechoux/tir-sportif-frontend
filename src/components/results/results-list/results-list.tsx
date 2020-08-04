import React, { useEffect, useState } from 'react';
import {
  Box,
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
import { formatString } from 'utils/date.utils';
import { ROUTES } from 'configurations/server.configuration';
import TableContainer from '@material-ui/core/TableContainer';
import { paginationTheme } from 'configurations/theme.configuration';
import { makeStyles } from '@material-ui/core/styles';
import { EMPTY_PAGE, Page } from 'services/models/page.model';
import { GetChallengeListElementResponse } from 'services/models/challenge.model';
import ChallengeService from 'services/challenge.service';
import Desktop from '../../media/desktop';
import Mobile from '../../media/mobile';
import MediaQuery from 'react-responsive';
import { MEDIA } from '../../../App.constants';

type ResultsProps = {
  actions: {
    error: (message: string) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ResultsList = (props: ResultsProps) => {
  const useStyles = makeStyles(theme => ({
    tableRow: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }));
  const classes = useStyles();

  const [pagedChallenges, setPagedChallenges] = useState<Page<GetChallengeListElementResponse>>(
    EMPTY_PAGE()
  );
  const [pageNumber, setPageNumber] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    let unmounted = false;
    ChallengeService.getChallenges(rowsPerPage, pageNumber)
      .then(response => {
        if (!unmounted) {
          if (response.status === 200) {
            setPagedChallenges(response.data);
          }
        }
      })
      .catch(() => {
        if (!unmounted) {
          props.actions.error('Impossible de récupérer la liste des challenges');
        }
      });
    return () => {
      unmounted = true;
    };
  }, [rowsPerPage, pageNumber]);

  const handleChangePage = (newRowsPerPageValue: number, newPageNumber: number) => {
    setRowsPerPage(newRowsPerPageValue);
    setPageNumber(newPageNumber);
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPageValue: number = parseInt(event.target.value, 10);
    handleChangePage(newRowsPerPageValue, 0);
  };

  return (
    <>
      <Desktop>
        <Box display="flex" justifyContent="center" pb={1}>
          <Box width={0.6}>
            <Grid container direction="column" alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h6">Résultats: Liste des challenges</Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box pt={2} display="flex" width={1}>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <colgroup>
                <col width={0.5} />
                <col width={0.5} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center">NOM</TableCell>
                  <TableCell align="center">DATE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedChallenges.content.map(challenge => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={challenge.id}
                    onClick={() => props.actions.push(`${ROUTES.RESULTS.LIST}/${challenge.id}`)}
                  >
                    <TableCell align="center">{challenge.name}</TableCell>
                    <TableCell align="center">
                      {formatString(challenge.startDate, "dd MMMM yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={2}
                    count={pagedChallenges.totalElements}
                    rowsPerPage={rowsPerPage}
                    page={pageNumber}
                    labelRowsPerPage={paginationTheme.rowsPerPage}
                    labelDisplayedRows={paginationTheme.displayedRowsArgs}
                    onChangePage={(event, pageNumber: number) =>
                      handleChangePage(pagedChallenges.pageable.pageSize, pageNumber)
                    }
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      </Desktop>
      <Mobile>
        Hello
      </Mobile>
    </>
  );
};

export default ResultsList;
