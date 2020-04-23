import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { Box, Button, FormControl, Grid, TextField, Typography } from '@material-ui/core';
import ScheduleIcon from '@material-ui/icons/Schedule';
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { ThunkAction } from 'redux-thunk';
import { AppState } from 'redux/reducers/combined.reducer';
import { CreateAddressRequest } from 'services/models/address.model';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../configurations/server.configuration';

type ChallengeCreationProps = {
  actions: {
    createChallenge: (
      name: string,
      address: CreateAddressRequest,
      startDate: Date,
      organiserClubId: number,
      categoryIds: number[],
      disciplineIds: number[]
    ) => ThunkAction<void, AppState, undefined, any>;
  };
};

const ChallengeCreation = (props: ChallengeCreationProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date('2019-12-21T12:00:00'));
  const [inputName, setName] = useState<string>('');

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date == null ? new Date('2019-12-21T12:00:00') : date);
  };

  const handleChallengeCreation = () => {
    const address: CreateAddressRequest = {
      street: 'Rue de Dolhain',
      city: 'Val de Briey',
      countryId: 74,
    };
    props.actions.createChallenge(inputName, address, selectedDate, 1, [1], [1]);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <form onSubmit={handleChallengeCreation} noValidate>
        <Grid container justify="center">
          <Grid item md={3} />
          <Grid item md={6}>
            <Grid item container direction="column">
              <Typography variant="h6">CRÉER UN CHALLENGE</Typography>
            </Grid>
            <Grid item md={6}>
              <TextField fullWidth required label="Nom du challenge" onChange={handleNameChange} />
            </Grid>
            <Grid item container md={12} spacing={1}>
              <Grid item md={6}>
                <FormControl fullWidth required>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker"
                    label="Date de début"
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6}>
                <FormControl fullWidth required>
                  <KeyboardTimePicker
                    margin="normal"
                    ampm={false}
                    id="time-picker"
                    label="Heure de début"
                    value={selectedDate}
                    onChange={handleDateChange}
                    keyboardIcon={<ScheduleIcon />}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid item container spacing={1} justify="flex-end" alignItems="center">
              <Grid item>
                <Button variant="outlined" component={Link} to={ROUTES.CHALLENGE.LIST}>
                  ANNULER
                </Button>
              </Grid>
              <Grid>
                <Button variant="contained" color="secondary" type="submit">
                  VALIDER
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={3} />
        </Grid>
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
