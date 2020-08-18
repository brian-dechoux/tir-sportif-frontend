import React, { useEffect, useState } from 'react';
import { ToastVariant } from '../../toast/toast';
import {
  Box,
  Button,
  Divider,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@material-ui/core';
import FinanceService from 'services/finance.service';
import { GetShooterFinanceResponse } from 'services/models/finance.model';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../configurations/server.configuration';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ActionValidationDialog, { DialogType } from '../../dialog/action-validation-dialog';
import TableContainer from '@material-ui/core/TableContainer';
import ErrorIcon from '@material-ui/icons/Error';
import PaymentIcon from '@material-ui/icons/Payment';
import { formatString } from '../../../utils/date.utils';

type MyClubLicenseeDetailProps = {
  shooterId: number;
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const MyClubBillsShooterDetail = (props: MyClubLicenseeDetailProps) => {

  const [shooterFinance, setShooterFinance] = useState<GetShooterFinanceResponse>();
  const [tabValue, setTabValue] = useState(0);
  const [billPaid, setBillPaid] = useState<number>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [billPaidValidated, setBillPaidValidated] = useState(false);

  useEffect(() => {
    let unmounted = false;
    FinanceService.getShooterFinance(props.shooterId)
      .then((shooterFinanceResponse) => {
        if (!unmounted) {
          setShooterFinance(shooterFinanceResponse.data);
        }
      })
      .catch(() => {
        props.actions.error(
          "Impossible de récupérer le détail des finances du tireur"
        );
      });
    return () => {
      unmounted = true;
    };
  }, []);

  useEffect(() => {
    if (billPaidValidated && billPaid) {
      FinanceService.payBill(props.shooterId, billPaid)
        .then((shooterFinanceResponse) => {
          props.actions.openToast('Facture payée', 'success');
          setShooterFinance(shooterFinanceResponse.data);
          setBillPaid(undefined);
          setDialogOpen(false);
          setBillPaidValidated(false);
        })
        .catch(() => {
          props.actions.error(
            "Impossible de payer la facture"
          );
          setBillPaidValidated(false);
        });
    }
  }, [billPaidValidated]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const dialog = dialogOpen ?
    <ActionValidationDialog
      dialogType={DialogType.WARNING}
      dialogTitle="Confirmation de paiement"
      dialogContentMessage="Confirmez-vous le paiement de cette facture ?"
      callbackValidateFn={() => {
        setBillPaidValidated(true);
        setDialogOpen(false);
      }}
      callbackCloseFn={() => {
        setBillPaid(undefined);
        setDialogOpen(false);
      }}
    /> : null;

  const handlePayButton = (unpaidBillId: number) => {
    setBillPaid(unpaidBillId);
    setDialogOpen(true);
  }

  const unpaidTable = (shooterFinance: GetShooterFinanceResponse) => <TableContainer>
    <Table stickyHeader>
      <colgroup>
        <col width={0.3} />
        <col width={0.3} />
        <col width={0.2} />
        <col width={0.2} />
      </colgroup>
      <TableHead>
        <TableRow>
          <TableCell align="center">CHALLENGE</TableCell>
          <TableCell align="center">DATE</TableCell>
          <TableCell align="center">PRIX</TableCell>
          <TableCell align="center">ACTION</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {shooterFinance.unpaidBills.map(unpaidBill => (
          <TableRow key={unpaidBill.id}>
            <TableCell align="center">{unpaidBill.challengeName}</TableCell>
            <TableCell align="center">{unpaidBill.startDate ? formatString(unpaidBill.startDate, "dd MMMM yyyy") : ''}</TableCell>
            <TableCell align="center">{unpaidBill.value}</TableCell>
            <TableCell align="center">
              <Button
                color="secondary"
                startIcon={<PaymentIcon />}
                onClick={() => handlePayButton(unpaidBill.id)}
              >
                PAYER
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>

  const participationsTable = (shooterFinance: GetShooterFinanceResponse) => <TableContainer>
    <Table stickyHeader>
      <colgroup>
        <col width={0.3} />
        <col width={0.3} />
        <col width={0.2} />
        <col width={0.2} />
      </colgroup>
      <TableHead>
        <TableRow>
          <TableCell align="center">CHALLENGE</TableCell>
          <TableCell align="center">DATE</TableCell>
          <TableCell align="center">PRIX</TableCell>
          <TableCell align="center">PAYÉ LE</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {shooterFinance.participationBills.map(participationBill => (
          <TableRow key={participationBill.id}>
            <TableCell align="center">{participationBill.challengeName}</TableCell>
            <TableCell align="center">{participationBill.startDate ? formatString(participationBill.startDate, "dd MMMM yyyy") : ''}</TableCell>
            <TableCell align="center">{participationBill.value}</TableCell>
            <TableCell align="center">{participationBill.paidDate ? formatString(participationBill.paidDate, "dd MMMM yyyy") : ''}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>

  const licencesTable = (shooterFinance: GetShooterFinanceResponse) => <TableContainer>
    <Table stickyHeader>
      <colgroup>
        <col width={0.4} />
        <col width={0.2} />
        <col width={0.4} />
      </colgroup>
      <TableHead>
        <TableRow>
          <TableCell align="center">DATE DE SOUSCRIPTION</TableCell>
          <TableCell align="center">PRIX</TableCell>
          <TableCell align="center">PAYÉ LE</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {shooterFinance.licenseBills.map(licenceBill => (
          <TableRow key={licenceBill.id}>
            <TableCell align="center">{licenceBill.subscriptionDate ? formatString(licenceBill.subscriptionDate, "dd MMMM yyyy") : ''}</TableCell>
            <TableCell align="center">{licenceBill.value}</TableCell>
            <TableCell align="center">{licenceBill.paidDate ? formatString(licenceBill.paidDate, "dd MMMM yyyy") : ''}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>

  const displayUnpaidBillsTable = (shooterFinance: GetShooterFinanceResponse) => {
    if (shooterFinance.unpaidBills.length > 0) {
      return (
        <Box pt={4}>
          <Paper elevation={1}>
            <Box display="flex" justifyContent="center" pb={1}>
              <ErrorIcon color="secondary" />
              <Typography variant="subtitle1">Factures non réglées en attente</Typography>
            </Box>
            {unpaidTable(shooterFinance)}
            {dialog}
          </Paper>
        </Box>
      );
    }
    return null;
  }

  const displayPaidBillsTables = (shooterFinance: GetShooterFinanceResponse) => {
    let tables;
    if (shooterFinance.participationBills.length > 0 && shooterFinance.licenseBills.length > 0) {
      tables =
        <>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <Tab label="Licences" />
            <Tab label="Participations" />
          </Tabs>
          {tabValue === 0 ? licencesTable(shooterFinance) : null}
          {tabValue === 1 ? participationsTable(shooterFinance) : null}
        </>
    } else if (shooterFinance.participationBills.length > 0) {
      tables = participationsTable(shooterFinance);
    } else if (shooterFinance.licenseBills.length > 0) {
      tables = licencesTable(shooterFinance);
    } else {
      return null;
    }
    return (
      <Box pt={4}>
        <Paper elevation={1}>
          <Box display="flex" justifyContent="center" pb={1}>
            <Typography variant="subtitle1">Factures réglées</Typography>
          </Box>
          {tables}
        </Paper>
      </Box>
    );
  }

  return shooterFinance ? (
    <>
      <Box display="flex" width={1}>
        <Box flexGrow={1}>
          <Button
            variant="outlined"
            component={Link} to={ROUTES.MYCLUB.BILLS.LIST}
            startIcon={<KeyboardBackspaceIcon />}
          >
            RETOUR
          </Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" pb={1}>
        <Typography variant="h6">Factures: {shooterFinance.lastname} {shooterFinance.firstname}</Typography>
      </Box>
      <Divider />
      {displayUnpaidBillsTable(shooterFinance)}
      {displayPaidBillsTables(shooterFinance)}
    </>
  ) : null;
};

export default MyClubBillsShooterDetail;
