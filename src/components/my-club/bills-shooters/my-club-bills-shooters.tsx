import React, { useEffect, useState } from 'react';
import { ToastVariant } from '../../toast/toast';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import FinanceService from 'services/finance.service';
import { makeStyles } from '@material-ui/core/styles';
import { EMPTY_PAGE, Page } from 'services/models/page.model';
import { GetShooterWithBillsListElementResponse } from 'services/models/finance.model';
import { ROUTES } from 'configurations/server.configuration';
import TableContainer from '@material-ui/core/TableContainer';
import { paginationTheme } from 'configurations/theme.configuration';

type MyClubResumeProps = {
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};


const MyClubBillsShooters = (props: MyClubResumeProps) => {
  const useStyles = makeStyles(theme => ({
    tableRow: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }));
  const classes = useStyles();

  const [pagedShooters, setPagedShooters] = useState<Page<GetShooterWithBillsListElementResponse>>(
    EMPTY_PAGE()
  );
  const [pageNumber, setPageNumber] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    let unmounted = false;
    FinanceService.getShootersWithBills(rowsPerPage, pageNumber)
      .then(response => {
        if (!unmounted) {
          if (response.status === 200) {
            setPagedShooters(response.data);
          }
        }
      })
      .catch(() => {
        if (!unmounted) {
          props.actions.error('Impossible de récupérer la liste des tireurs ayant au moins une facture');
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
                <TableCell align="center">PRÉNOM</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedShooters.content.map(shooter => (
                <TableRow
                  className={classes.tableRow}
                  hover
                  key={shooter.id}
                  onClick={() => props.actions.push(`${ROUTES.MYCLUB.BILLS.LIST}/${shooter.id}`)}
                >
                  <TableCell align="center">{shooter.lastname}</TableCell>
                  <TableCell align="center">{shooter.firstname}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={2}
                  count={pagedShooters.totalElements}
                  rowsPerPage={rowsPerPage}
                  page={pageNumber}
                  labelRowsPerPage={paginationTheme.rowsPerPage}
                  labelDisplayedRows={paginationTheme.displayedRowsArgs}
                  onChangePage={(event, pageNumber: number) =>
                    handleChangePage(pagedShooters.pageable.pageSize, pageNumber)
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

export default MyClubBillsShooters;
