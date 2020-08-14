import React, { useEffect, useState } from 'react';
import { ToastVariant } from '../../../toast/toast';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { ROUTES } from 'configurations/server.configuration';
import { GetCountryResponse } from 'services/models/country.model';
import LicenceService from 'services/licensee.service';

type MyClubLicenseeCreationProps = {
  countries: GetCountryResponse[];
  callbackShooterFn: () => Promise<number>;
  shooterFirstname: string;
  shooterLastname: string;
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
    resetShooter: () => any;
  };
};


const MyClubLicenseeCreationSpecificInfos = (props: MyClubLicenseeCreationProps) => {
  const [formSent, setFormSent] = useState(false);

  const [inputBadge, setInputBadge] = useState(0);
  const [inputLocker, setInputLocker] = useState();
  const [inputAddressNumber, setAddressNumber] = useState('');
  const [inputAddressStreet, setAddressStreet] = useState('');
  const [inputAddressZip, setAddressZip] = useState('');
  const [inputAddressCity, setAddressCity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const [badgeValid, setBadgeValid] = useState(true);
  const [streetValid, setStreetValid] = useState(true);
  const [cityValid, setCityValid] = useState(true);
  const [countryValid, setCountrValid] = useState(true);
  const informationFormValid = ![inputBadge > 0, !!inputAddressStreet, !!inputAddressCity, !!selectedCountry].some(
    validation => !validation
  );

  useEffect(() => {
    if (formSent) {
      props.callbackShooterFn().then(shooterId => {
        const addressPayload = {
          number: inputAddressNumber,
          street: inputAddressStreet,
          zip: inputAddressZip,
          city: inputAddressCity,
          countryId: props.countries.find(country => country.name === selectedCountry)?.id ?? -1,
        };
        return LicenceService.createLicence(
          inputBadge,
          shooterId,
          addressPayload,
          inputLocker
        );
      }).then(response => {
        if (response.status === 201) {
          props.actions.openToast('La licence a été créée', 'success');
          props.actions.push(`${ROUTES.MYCLUB.LICENSEES.LIST}/${response.data.id}`);
          props.actions.resetShooter();
        } else {
          throw new Error();
        }
      }).catch(() => {
        // TODO Reset full form in case of error
        // FIXME one route for participation + create ?
        props.actions.error("Impossible de créer la licence");
        setFormSent(false);
      });
    }
  }, [formSent]);

  const handleBadgeChange = (event: any) => {
    const newValue = event.target.value;
    setBadgeValid(newValue > 0);
    setInputBadge(newValue);
  };

  const handleLockerChange = (event: any) => {
    const newValue = event.target.value;
    setInputLocker(newValue);
  };

  const handleStreetChange = (event: any) => {
    const newValue = event.target.value;
    setStreetValid(!!newValue);
    setAddressStreet(newValue);
  };

  const handleCityChange = (event: any) => {
    const newValue = event.target.value;
    setCityValid(!!newValue);
    setAddressCity(newValue);
  };

  const handleCountryChange = (event: any) => {
    const newValue = event.target.value;
    setCountrValid(!!newValue);
    setSelectedCountry(newValue);
  };

  const handleCancel = () => {
    props.actions.push(ROUTES.MYCLUB.LICENSEES.LIST);
    props.actions.resetShooter();
  }

  return (
    <Box display="flex" justifyContent="center" pt={2}>
      <Box display="flex" flexDirection="column" width={0.8}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h6">
              {`${props.shooterFirstname} ${props.shooterLastname}`.toUpperCase()}: CRÉATION DE LICENCE
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Équipements du club</Typography>
          </Grid>
          <Grid item md={6}>
            <TextField
              error={!badgeValid}
              inputProps={{ type: 'number', step: 1, min: 1 }}
              fullWidth
              required
              label="Numéro de badge"
              onChange={handleBadgeChange}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              inputProps={{ type: 'number', step: 1, min: 1 }}
              fullWidth
              label="Numéro de casier"
              onChange={handleLockerChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Addresse</Typography>
          </Grid>
          <Grid item md={3}>
            <TextField
              fullWidth
              label="Numéro"
              onChange={(event: any) => setAddressNumber(event.target.value)}
            />
          </Grid>
          <Grid item md={9}>
            <TextField
              error={!streetValid}
              fullWidth
              required
              label="Rue"
              onChange={handleStreetChange}
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              fullWidth
              label="Code postal"
              onChange={(event: any) => setAddressZip(event.target.value)}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              error={!cityValid}
              fullWidth
              required
              label="Ville"
              onChange={handleCityChange}
            />
          </Grid>
          <Grid item md={3}>
            <FormControl required fullWidth error={!countryValid}>
              <InputLabel>Pays</InputLabel>
              <Select value={selectedCountry} onChange={handleCountryChange}>
                {props.countries.map(country => (
                  <MenuItem key={country.id} value={country.name}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item container spacing={2} justify="flex-end" alignItems="center">
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleCancel}
              >
                ANNULER
              </Button>
            </Grid>
            <Grid>
              <Button
                disabled={!informationFormValid}
                variant="contained"
                color="secondary"
                type="button"
                onClick={() => setFormSent(true)}
              >
                CRÉER LA LICENCE
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MyClubLicenseeCreationSpecificInfos;
