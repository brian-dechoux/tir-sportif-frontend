import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThunkAction } from 'redux-thunk';
import { AppState } from 'redux/reducers/combined.reducer';
import { CreateAddressRequest } from 'services/models/address.model';
import { Link } from 'react-router-dom';
import { ROUTES } from 'configurations/server.configuration';
import { fr } from 'date-fns/locale';
import { datePickerLabels } from 'configurations/theme.configuration';
import { CallHistoryMethodAction } from 'connected-react-router';
import ChallengeService from '../../../services/challenge.service';

type ChallengeCreationProps = {
  actions: {
    error: (message: string) => ThunkAction<void, AppState, undefined, any>;
    push: (
      path: string,
      state?: any | undefined
    ) => CallHistoryMethodAction<[string, (any | undefined)?]>;
  };
};

const ChallengeCreation = (props: ChallengeCreationProps) => {
  const [challengeNameValid, setChallengeNameValid] = useState(true);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [inputName, setName] = useState('');

  const formValid = ![challengeNameValid, !!selectedDateTime].some(validation => !validation);

  const handleNameChange = (event: any) => {
    const newValue = event.target.value;
    setChallengeNameValid(!!newValue);
    setName(newValue);
  };

  const handleChallengeCreation = () => {
    const address: CreateAddressRequest = {
      street: 'Rue de Dolhain',
      city: 'Val de Briey',
      countryId: 74,
    };

    // FIXME BDX throw if null date
    ChallengeService.createChallenge(
      inputName,
      address,
      selectedDateTime ? selectedDateTime : new Date(),
      1,
      [1],
      [1]
    )
      .then(response => {
        // TODO check error handling here with a 500
        if (response.status === 201) {
          props.actions.push(ROUTES.CHALLENGE.LIST);
        } else {
          props.actions.error('Impossible de créer le challenge');
        }
      })
      .catch(() => {
        props.actions.error('Impossible de créer le challenge');
      });
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fr}>
      <form onSubmit={handleChallengeCreation} noValidate>
        <Box display="flex" justifyContent="center">
          <Box display="flex" width={0.6}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h6">CRÉER UN CHALLENGE</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={!challengeNameValid}
                  fullWidth
                  required
                  label="Nom du challenge"
                  onChange={handleNameChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <DateTimePicker
                    required
                    disablePast
                    placeholder="10/10/2010 10:10"
                    format="dd/MM/yyyy hh:mm"
                    margin="normal"
                    ampm={false}
                    id="datetime-picker"
                    label="Date et heure du challenge"
                    value={selectedDateTime}
                    onChange={setSelectedDateTime}
                    clearLabel={datePickerLabels.clearLabel}
                    cancelLabel={datePickerLabels.cancelLabel}
                    okLabel={datePickerLabels.okLabel}
                    todayLabel={datePickerLabels.todayLabel}
                    invalidDateMessage={datePickerLabels.invalidDateMessage}
                  />
                </FormControl>
              </Grid>
              <Grid item container spacing={2} justify="flex-end" alignItems="center">
                <Grid item>
                  <Button variant="outlined" component={Link} to={ROUTES.CHALLENGE.LIST}>
                    ANNULER
                  </Button>
                </Grid>
                <Grid>
                  <Button disabled={!formValid} variant="contained" color="secondary" type="submit">
                    VALIDER
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </form>
    </MuiPickersUtilsProvider>
  );
};

export default ChallengeCreation;

/*
const [inputAddressNumber, setAddressNumber] = useState<string>('');
const [inputAddressStreet, setAddressStreet] = useState<string>('');
const [inputAddressZip, setAddressZip] = useState<string>('');
const [inputAddressCity, setAddressCity] = useState<string>('');
const [inputAddressCountry, setAddressCountry] = useState<number>(1);

const handleAddressNumberChange = (event: any) => {
  setAddressNumber(event.target.value);
};
const handleAddressStreetChange = (event: any) => {
  setAddressStreet(event.target.value);
};
const handleAddressZipChange = (event: any) => {
  setAddressZip(event.target.value);
};
const handleAddressCityChange = (event: any) => {
  setAddressCity(event.target.value);
};
const handleAddressCountryChange = (event: any) => {
  setAddressCountry(event.target.value);
};

<Grid container>
  <Grid item md={1}>
    <TextField id="standard-basic" label="Numéro" onChange={handleAddressNumberChange} />
  </Grid>
  <Grid item md={6}>
    <TextField id="standard-basic" label="Rue" onChange={handleAddressStreetChange} />
  </Grid>
  <Grid item md={1}>
    <TextField id="standard-basic" label="Code postal" onChange={handleAddressZipChange} />
  </Grid>
  <Grid item md={3}>
    <TextField id="standard-basic" label="Ville" onChange={handleAddressCityChange} />
  </Grid>
  <Grid item md={1}>
    <TextField id="standard-basic" label="Pays" onChange={handleAddressCountryChange} />
  </Grid>
</Grid>
 */
