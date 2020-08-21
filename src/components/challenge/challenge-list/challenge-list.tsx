import React, { useEffect, useState } from 'react';
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
  Typography,
} from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import AddIcon from '@material-ui/icons/Add';
import { GetChallengeListElementResponse } from 'services/models/challenge.model';
import { ROUTES } from 'configurations/server.configuration';
import { formatString } from 'utils/date.utils';
import { EMPTY_PAGE, Page } from 'services/models/page.model';
import ChallengeService from 'services/challenge.service';
import { makeStyles } from '@material-ui/core/styles';
import { paginationTheme } from 'configurations/theme.configuration';
import { tableHoveredRow } from '../../../configurations/styles.configuration';

type ChallengeListProps = {
  actions: {
    error: (message: string) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ChallengeList = (props: ChallengeListProps) => {
  const useStyles = makeStyles(() => ({
    tableRow: tableHoveredRow,
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

  const handleClickOnCreateChallengeButton = () => {
    props.actions.push(ROUTES.CHALLENGE.CREATION);
  };

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
      <Box display="flex" width={1}>
        <Box flexGrow={1}/>
        <Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClickOnCreateChallengeButton}
            startIcon={<AddIcon />}
          >
            CRÉER UN CHALLENGE
          </Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" pb={1}>
        <Box width={0.6}>
          <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h6">Challenges</Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box pt={2} display="flex" width={1}>
        <TableContainer component={Paper}>
            <Table stickyHeader>
              <colgroup>
                <col width={0.3} />
                <col width={0.2} />
                <col width={0.2} />
                <col width={0.3} />
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
                {pagedChallenges.content.map(challenge => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={challenge.id}
                    onClick={() => props.actions.push(`${ROUTES.CHALLENGE.LIST}/${challenge.id}`)}
                  >
                    <TableCell align="center">{challenge.name}</TableCell>
                    <TableCell align="center">
                      {formatString(challenge.startDate, "dd MMMM yyyy 'à' hh'h'mm")}
                    </TableCell>
                    <TableCell align="center">{challenge.nbShooters}</TableCell>
                    <TableCell align="center">{challenge.city}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={4}
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
    </>
  );
};

export default ChallengeList;
