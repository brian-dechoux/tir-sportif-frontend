import React, { useEffect, useState } from 'react';
import { ToastVariant } from '../../toast/toast';
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
import LicenseeService from 'services/licensee.service';
import { makeStyles } from '@material-ui/core/styles';
import { EMPTY_PAGE, Page } from 'services/models/page.model';
import { GetLicenseeListElementResponse } from 'services/models/licensee.model';
import { ROUTES } from 'configurations/server.configuration';
import AddIcon from '@material-ui/icons/Add';
import TableContainer from '@material-ui/core/TableContainer';
import { formatString } from 'utils/date.utils';
import { paginationTheme } from 'configurations/theme.configuration';

type MyClubResumeProps = {
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};


const MyClubLicensees = (props: MyClubResumeProps) => {
  const useStyles = makeStyles(theme => ({
    tableRow: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }));
  const classes = useStyles();

  const [pagedLicensees, setPagedLicensees] = useState<Page<GetLicenseeListElementResponse>>(
    EMPTY_PAGE()
  );
  const [pageNumber, setPageNumber] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    let unmounted = false;
    LicenseeService.getLicensees(rowsPerPage, pageNumber)
      .then(response => {
        if (!unmounted) {
          if (response.status === 200) {
            setPagedLicensees(response.data);
          }
        }
      })
      .catch(() => {
        if (!unmounted) {
          props.actions.error('Impossible de récupérer la liste des licenciés');
        }
      });
    return () => {
      unmounted = true;
    };
  }, [rowsPerPage, pageNumber]);

  const handleClickOnCreateLicenseeButton = () => {
    props.actions.push(ROUTES.MYCLUB.LICENSEES.CREATION);
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
            onClick={handleClickOnCreateLicenseeButton}
            startIcon={<AddIcon />}
          >
            AJOUTER UN LICENCIÉ
          </Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" pb={1}>
        <Box width={0.6}>
          <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h6">Licenciés</Typography>
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
                <TableCell align="center">PRÉNOM</TableCell>
                <TableCell align="center">DATE DE SOUSCRIPTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedLicensees.content.map(licensee => (
                <TableRow
                  className={classes.tableRow}
                  hover
                  key={licensee.id}
                  onClick={() => props.actions.push(`${ROUTES.MYCLUB.LICENSEES.LIST}/${licensee.id}`)}
                >
                  <TableCell align="center">{licensee.lastname}</TableCell>
                  <TableCell align="center">{licensee.firstname}</TableCell>
                  <TableCell align="center">
                    {formatString(licensee.subscriptionDate, "dd MMMM yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={4}
                  count={pagedLicensees.totalElements}
                  rowsPerPage={rowsPerPage}
                  page={pageNumber}
                  labelRowsPerPage={paginationTheme.rowsPerPage}
                  labelDisplayedRows={paginationTheme.displayedRowsArgs}
                  onChangePage={(event, pageNumber: number) =>
                    handleChangePage(pagedLicensees.pageable.pageSize, pageNumber)
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

export default MyClubLicensees;
