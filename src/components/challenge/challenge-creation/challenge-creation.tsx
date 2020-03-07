import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { Box, Button, Grid, TextField } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import { ThunkAction } from 'redux-thunk';
import { AppState } from 'redux/reducers/combined.reducer';
import { CreateAddressRequest } from 'services/models/address.model';

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
    // TODO Toast
  };

  return (
    <>
      <Box>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify={'center'}>
            <Grid item md={2} />
            <Grid container item md={8} direction="column" spacing={3}>
              <TextField id="standard-basic" label="Nom du challenge" onChange={handleNameChange} />
              <Grid container>
                <Grid item md={6}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
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
                  />
                </Grid>
              </Grid>
              <Button variant="contained" onClick={handleChallengeCreation}>
                CREER
              </Button>
            </Grid>
            <Grid item md={2} />
          </Grid>
        </MuiPickersUtilsProvider>
      </Box>
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
