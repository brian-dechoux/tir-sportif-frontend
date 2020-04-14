import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { Button, Grid, TextField } from '@material-ui/core';
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
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container direction="column" justify="center">
          <Grid item>
            <TextField label="Nom du challenge" onChange={handleNameChange} />
          </Grid>
          <Grid item>
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
            <KeyboardTimePicker
              margin="normal"
              ampm={false}
              id="time-picker"
              label="Heure de début"
              value={selectedDate}
              onChange={handleDateChange}
              keyboardIcon={<ScheduleIcon />}
            />
          </Grid>
          <Grid container item spacing={2}>
            <Grid item>
              <Button variant="outlined" component={Link} to={ROUTES.CHALLENGE.LIST}>
                ANNULER
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={handleChallengeCreation}>
                CREER
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    </>
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
