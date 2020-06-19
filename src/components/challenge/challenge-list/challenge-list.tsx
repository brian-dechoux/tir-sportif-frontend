import React, { useState } from 'react';
import {
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
import { ROUTES } from 'configurations/server.configuration';
import { formatString } from 'utils/date.utils';
import { EMPTY_PAGE, Page } from 'services/models/page.model';
import ChallengeService from 'services/challenge.service';
import { makeStyles } from '@material-ui/core/styles';
import { paginationTheme } from '../../../configurations/theme.configuration';

type ChallengeListProps = {
  actions: {
    error: (message: string) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

// FIXME Why in this particular table, the footer is not full width ???

// TODO Add CSS for table:
//  - cells align=center
const ChallengeList = (props: ChallengeListProps) => {
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

  const handleChangePage = (pageSize: number, pageNumber: number) => {
    ChallengeService.getChallenges(pageSize, pageNumber)
      .then(response => {
        if (response.status === 200) {
          setPagedChallenges(response.data);
        }
      })
      .catch(() => {
        props.actions.error('Impossible de récupérer la liste des challenges');
      });
  };

  // TODO useEffect ?
  if (pagedChallenges.pageable?.pageNumber === -1) {
    handleChangePage(pagedChallenges.pageable.pageSize, 0);
  }

  const handleClickOnCreateChallengeButton = () => {
    props.actions.push(ROUTES.CHALLENGE.CREATION);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPageValue: number = parseInt(event.target.value, 10);
    handleChangePage(newRowsPerPageValue, 0);
  };

  return (
    <>
      <Grid container direction="column" justify="center" spacing={2}>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClickOnCreateChallengeButton}
            startIcon={<AddIcon />}
          >
            CRÉER UN CHALLENGE
          </Button>
        </Grid>
        <Grid item>
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
                    colSpan={3}
                    count={pagedChallenges.totalElements}
                    rowsPerPage={pagedChallenges.pageable.pageSize}
                    page={
                      pagedChallenges.pageable.pageNumber === -1
                        ? 0
                        : pagedChallenges.pageable.pageNumber
                    }
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
        </Grid>
      </Grid>
    </>
  );
};

export default ChallengeList;
