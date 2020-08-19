import {
  Box,
  Button, Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ClubService from 'services/club.service';
import { GetCountryResponse } from 'services/models/country.model';
import { ToastVariant } from '../../toast/toast';
import { ROUTES } from 'configurations/server.configuration';
import { REGEXES } from 'App.constants';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

type AddShooterProps = {
  countries: GetCountryResponse[];
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ClubCreation = (props: AddShooterProps) => {

  const [formSent, setFormSent] = useState(false);
  const [inputName, setInputName] = useState('');
  const [inputEmail, setEmail] = useState('');
  const [inputAddressNumber, setAddressNumber] = useState('');
  const [inputAddressStreet, setAddressStreet] = useState('');
  const [inputAddressZip, setAddressZip] = useState('');
  const [inputAddressCity, setAddressCity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const [nameValid, setNameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [streetValid, setStreetValid] = useState(true);
  const [cityValid, setCityValid] = useState(true);
  const [countryValid, setCountrValid] = useState(true);
  const informationFormValid = ![emailValid, !!inputName, !!inputAddressStreet, !!inputAddressCity, !!selectedCountry].some(
    validation => !validation
  );

  useEffect(() => {
    if (formSent) {
      const addressPayload = {
        number: inputAddressNumber,
        street: inputAddressStreet,
        zip: inputAddressZip,
        city: inputAddressCity,
        countryId: props.countries.find(country => country.name === selectedCountry)?.id ?? -1,
      };
      ClubService.createClub(
        inputName,
        inputEmail,
        addressPayload
      ).then((response) => {
        if (response.status === 201) {
          props.actions.openToast('Le club a été créé', 'success');
          props.actions.push(`${ROUTES.CLUBS.LIST}/${response.data.id}`);
        } else {
          throw new Error();
        }
        })
        .catch(() => {
          props.actions.error("Impossible de créer le club");
          setFormSent(false);
        });
    }
  }, [formSent]);

  const handleNameChange = (event: any) => {
    const newValue = event.target.value;
    setNameValid(!!newValue);
    setInputName(newValue);
  };

  const handleEmailChange = (event: any) => {
    const newValue = event.target.value;
    setEmailValid(RegExp(REGEXES.EMAIL).test(newValue));
    setEmail(newValue);
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

  return (
    <form noValidate>
      <Box display="flex" justifyContent="center">
        <Box display="flex" flexDirection="column" width={0.8}>
          <Box pb={2}>
            <Button
              variant="outlined"
              component={Link} to={ROUTES.CLUBS.LIST}
              startIcon={<KeyboardBackspaceIcon />}
            >
              RETOUR
            </Button>
          </Box>
          <Box display="flex" justifyContent="center">
            <Typography variant="h6">Créer un club</Typography>
          </Box>
          <Divider />
          <Box pt={2}>
            <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="subtitle2">Informations générales</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                error={!nameValid}
                fullWidth
                required
                label="Nom"
                onChange={handleNameChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Email"
                onChange={handleEmailChange}
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
                  component={Link}
                  to={ROUTES.CLUBS.LIST}
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
                  VALIDER
                </Button>
              </Grid>
            </Grid>
      </Grid>
          </Box>
        </Box>
      </Box>
    </form>
  );
}

export default ClubCreation;
