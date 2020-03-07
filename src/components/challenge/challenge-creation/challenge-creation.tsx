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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleChallengeCreation = () => {
    const testAddress: CreateAddressRequest = {
      number: '2',
      street: 'rue test',
      city: 'TEST',
      zip: '123',
      countryId: 1,
    };
    props.actions.createChallenge(
      'testing2',
      testAddress,
      new Date('2020-09-09T21:11:54'),
      1,
      [1],
      [1]
    );
    // TODO Toast
  };

  return (
    <>
      <Box>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container>
            <Grid item md={2} />
            <Grid container item md={8} direction="column" spacing={3}>
              <TextField id="standard-basic" label="Nom du challenge" />
              <Grid container>
                <Grid item md={6}>
                  <Grid container>
                    <Grid item md={1}>
                      Du:
                    </Grid>
                    <Grid item md={11}>
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
