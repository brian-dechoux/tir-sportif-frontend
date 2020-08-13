import React, { useEffect, useState } from 'react';
import { ToastVariant } from '../../toast/toast';
import { Box, Button, Divider, Grid, Typography } from '@material-ui/core';
import LicenseeService from 'services/licensee.service';
import { GetLicenseeResponse } from 'services/models/licensee.model';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../configurations/server.configuration';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import EditIcon from '@material-ui/icons/Edit';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import HomeIcon from '@material-ui/icons/Home';
import EmailIcon from '@material-ui/icons/Email';
import EventIcon from '@material-ui/icons/Event';
import RefreshIcon from '@material-ui/icons/Refresh';
import { formatString } from '../../../utils/date.utils';
import ActionValidationDialog, { DialogType } from '../../dialog/action-validation-dialog';

type MyClubLicenseeDetailProps = {
  licenseeId: number;
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};


const MyClubLicenseeDetail = (props: MyClubLicenseeDetailProps) => {

  const [licensee, setLicensee] = useState<GetLicenseeResponse>();
  const [licenseeRenewed, setLicenseeRenewed] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let unmounted = false;
    LicenseeService.getLicensee(props.licenseeId)
      .then((licenseeDetailResponse) => {
        if (!unmounted) {
          setLicensee(licenseeDetailResponse.data);
        }
      })
      .catch(() => {
        props.actions.error(
          "Impossible de récupérer le détail du licencié"
        );
      });
    return () => {
      unmounted = true;
    };
  }, []);

  useEffect(() => {
    if (licenseeRenewed) {
      LicenseeService.renewLicensee(props.licenseeId)
        .then((licenseeDetailResponse) => {
          setLicensee(licenseeDetailResponse.data);
          setLicenseeRenewed(false);
          props.actions.openToast('Licence renouvellée avec succès, facture générée', 'success');
        })
        .catch(() => {
          setLicenseeRenewed(false);
          props.actions.error(
            "Impossible de renouveller la licence"
          );
        });
    }
  }, [licenseeRenewed]);

  const dialog = dialogOpen ?
    <ActionValidationDialog
      dialogType={DialogType.WARNING}
      dialogTitle="Confirmation de renouvellement"
      dialogContentMessage="Confirmez-vous le renouvellement de la licence ?"
      callbackValidateFn={() => {
        setLicenseeRenewed(true);
        setDialogOpen(false);
      }}
      callbackCloseFn={() => setDialogOpen(false)}
    /> : null;

  return licensee ? (
    <>
      <Box display="flex" width={1}>
        <Box flexGrow={1}>
          <Button
            variant="outlined"
            component={Link} to={ROUTES.MYCLUB.LICENSEES}
            startIcon={<KeyboardBackspaceIcon />}
          >
            RETOUR
          </Button>
        </Box>
        <Box display="flex">
          <Box display="flex" pr={1}>
            {licensee.shooter.email ?
              <Box pr={1}>
                <Button
                  variant="outlined"
                  startIcon={<EmailIcon color="secondary"/>}
                  component="a"
                  href={`mailto:${licensee.shooter.email}`}
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
      <Box display="flex" justifyContent="center" pb={1}>
        <Typography variant="h6">Licencié: {licensee.shooter.lastname} {licensee.shooter.firstname}</Typography>
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-evenly" pt={2} pb={1}>
        <Box display="flex" alignItems="center">
          <EventIcon />
          <Typography variant="subtitle1">Date de souscription de license le {formatString(licensee.subscriptionDate, "dd MMMM yyyy")}</Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon color="secondary"/>}
          onClick={() => setDialogOpen(true)}
        >
          RENOUVELER
        </Button>
        {dialog}
      </Box>
      <Divider />
      <Box pt={2}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box display="flex" justifyContent="center">
              <HomeIcon />
              <Typography variant="subtitle1">
                Réside: {licensee.address.number} {licensee.address.street}, {licensee.address.zip} {licensee.address.city}, {licensee.address.countryName}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" justifyContent="center">
              <Typography variant="subtitle1">
                Catégorie: {licensee.shooter.category.label}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" justifyContent="center">
              <LocalOfferIcon />
              <Typography variant="subtitle1">Numéro de badge: {licensee.badgeNumber}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" justifyContent="center">
              {
                licensee.lockerNumber ?
                  <>
                    <LockIcon />
                    <Typography variant="subtitle1">Numéro de casier: {licensee.lockerNumber}</Typography>
                  </> :
                  <>
                    <LockOpenIcon />
                    <Typography variant="subtitle1">Pas de casier affecté</Typography>
                  </>
              }
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  ) : null;
};

export default MyClubLicenseeDetail;
