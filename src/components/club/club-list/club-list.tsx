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
import { ROUTES } from 'configurations/server.configuration';
import { EMPTY_PAGE, Page } from 'services/models/page.model';
import ClubService from 'services/club.service';
import { makeStyles } from '@material-ui/core/styles';
import { paginationTheme } from 'configurations/theme.configuration';
import { tableHoveredRow } from 'configurations/styles.configuration';
import { GetClubListElementResponse } from 'services/models/club.model';

type ChallengeListProps = {
  actions: {
    error: (message: string) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ClubList = (props: ChallengeListProps) => {
  const useStyles = makeStyles(() => ({
    tableRow: tableHoveredRow,
  }));
  const classes = useStyles();

  const [pagedClubs, setPagedClubs] = useState<Page<GetClubListElementResponse>>(
    EMPTY_PAGE()
  );
  const [pageNumber, setPageNumber] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    let unmounted = false;
    ClubService.searchClubs(rowsPerPage, pageNumber)
      .then(response => {
        if (!unmounted) {
          if (response.status === 200) {
            setPagedClubs(response.data);
          }
        }
      })
      .catch(() => {
        if (!unmounted) {
          props.actions.error('Impossible de récupérer la liste des clubs');
        }
      });
    return () => {
      unmounted = true;
    };
  }, [rowsPerPage, pageNumber]);

  const handleClickOnCreateClubButton = () => {
    props.actions.push(ROUTES.CLUBS.CREATION);
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
            onClick={handleClickOnCreateClubButton}
            startIcon={<AddIcon />}
          >
            CRÉER UN CLUB
          </Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" pb={1}>
        <Box width={0.6}>
          <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h6">Clubs</Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box pt={2} display="flex" width={1}>
        <TableContainer component={Paper}>
            <Table stickyHeader>
              <colgroup>
                <col width={0.4} />
                <col width={0.3} />
                <col width={0.3} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center">NOM</TableCell>
                  <TableCell align="center">VILLE</TableCell>
                  <TableCell align="center">NOMBRE DE TIREURS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedClubs.content.map(club => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={club.id}
                    onClick={() => props.actions.push(`${ROUTES.CLUBS.LIST}/${club.id}`)}
                  >
                    <TableCell align="center">{club.name}</TableCell>
                    <TableCell align="center">{club.city}</TableCell>
                    <TableCell align="center">{club.nbShooters}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={3}
                    count={pagedClubs.totalElements}
                    rowsPerPage={rowsPerPage}
                    page={pageNumber}
                    labelRowsPerPage={paginationTheme.rowsPerPage}
                    labelDisplayedRows={paginationTheme.displayedRowsArgs}
                    onChangePage={(event, pageNumber: number) =>
                      handleChangePage(pagedClubs.pageable.pageSize, pageNumber)
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

export default ClubList;
