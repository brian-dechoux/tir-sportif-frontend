import React, { useEffect, useState } from 'react';
import { ToastVariant } from '../../toast/toast';
import {
  Box,
  Button,
  Divider,
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
import ClubService from 'services/club.service';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../configurations/server.configuration';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import EditIcon from '@material-ui/icons/Edit';
import EmailIcon from '@material-ui/icons/Email';
import { GetClubResponse } from '../../../services/models/club.model';
import TableContainer from '@material-ui/core/TableContainer';
import { paginationTheme } from '../../../configurations/theme.configuration';
import { makeStyles } from '@material-ui/core/styles';
import { tableHoveredRow } from '../../../configurations/styles.configuration';
import { EMPTY_PAGE, Page } from '../../../services/models/page.model';
import { GetShooterListElementResponse } from '../../../services/models/shooter.model';
import AddIcon from '@material-ui/icons/Add';

type MyClubLicenseeDetailProps = {
  clubId: number;
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};


const ClubDetail = (props: MyClubLicenseeDetailProps) => {
  const useStyles = makeStyles(() => ({
    tableRow: tableHoveredRow,
  }));
  const classes = useStyles();

  const [pagedShooters, setPagedShooters] = useState<Page<GetShooterListElementResponse>>(
    EMPTY_PAGE()
  );
  const [pageNumber, setPageNumber] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [club, setClub] = useState<GetClubResponse>();

  useEffect(() => {
    let unmounted = false;
    Promise.all([
      ClubService.getClub(props.clubId),
      ClubService.getShooters(props.clubId, rowsPerPage, pageNumber)
    ]).then(([clubDetailResponse, shootersResponse]) => {
        if (!unmounted) {
          setClub(clubDetailResponse.data);
          setPagedShooters(shootersResponse.data)
        }
      })
      .catch(() => {
        props.actions.error(
          "Impossible de récupérer les informations du club"
        );
      });
    return () => {
      unmounted = true;
    };
  }, []);

  const handleChangePage = (newRowsPerPageValue: number, newPageNumber: number) => {
    setRowsPerPage(newRowsPerPageValue);
    setPageNumber(newPageNumber);
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPageValue: number = parseInt(event.target.value, 10);
    handleChangePage(newRowsPerPageValue, 0);
  };

  return club ? (
    <>
      <Box display="flex" width={1}>
        <Box flexGrow={1}>
          <Button
            variant="outlined"
            component={Link} to={ROUTES.CLUBS.LIST}
            startIcon={<KeyboardBackspaceIcon />}
          >
            RETOUR
          </Button>
        </Box>
        <Box display="flex">
          <Box display="flex">
            {club.email ?
              <Box pr={1}>
                <Button
                  variant="outlined"
                  startIcon={<EmailIcon color="secondary"/>}
                  component="a"
                  href={`mailto:${club.email}`}
                >
                  CONTACTER
                </Button>
              </Box> : null
            }
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
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" width={1} alignItems="center">
        <Typography variant="h6">{club.name}</Typography>
        <Typography variant="body1">
          Se situe à {club.address.city}, {club.address.number} {club.address.street}, {club.address.countryName}
        </Typography>
      </Box>
      <Divider />
      <Box pt={4} flexDirection="column" display="flex" width={1}>
        <Box alignContent="center" display="flex" width={1}>
          <Box alignContent="center" display="flex" flexGrow={1}>
            <Typography variant="h6">Tireurs inscrits au club</Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to={`${ROUTES.CLUBS.LIST}/${props.clubId}/${ROUTES.CLUBS.SHOOTERS.CREATION}`}
            startIcon={<AddIcon />}
          >
            AJOUTER UN TIREUR
          </Button>
        </Box>
        {
          pagedShooters.totalElements !== 0 ? (
            <Box pt={2} display="flex" justifyContent="center" width={1}>
              <TableContainer component={Paper}>
            <Table stickyHeader>
              <colgroup>
                <col width={0.4} />
                <col width={0.4} />
                <col width={0.2} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center">NOM</TableCell>
                  <TableCell align="center">PRÉNOM</TableCell>
                  <TableCell align="center">CATÉGORIE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedShooters.content.map(shooter => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={shooter.id}
                    onClick={() => props.actions.push(`${ROUTES.CLUBS.LIST}/${club.id}`)}
                  >
                    <TableCell align="center">{shooter.lastname}</TableCell>
                    <TableCell align="center">{shooter.firstname}</TableCell>
                    <TableCell align="center">{shooter.categoryLabel}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={3}
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
          ) : (
            <Box pt={2} display="flex" justifyContent="center" width={1}>
              <Typography variant="subtitle1">
                Aucun tireur n'est inscrit pour le moment
              </Typography>
            </Box>
          )
        }
      </Box>
    </>
  ) : null;
};

export default ClubDetail;
