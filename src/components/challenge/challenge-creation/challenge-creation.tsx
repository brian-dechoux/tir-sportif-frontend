import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { Box, Grid, TextField, Typography } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from '@material-ui/pickers';

type ChallengeCreationProps = {
  actions: {};
};

const ChallengeCreation = (props: ChallengeCreationProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date('2014-08-18T21:11:54'));

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  return (
    <>
      <Box>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="center">
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
                <Grid item md={6}>
                  <Grid container>
                    <Grid item md={1}>
                      Au:
                    </Grid>
                    <Grid item md={11}>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Date de fin"
                        value={selectedDate}
                        onChange={handleDateChange}
                      />
                      <KeyboardTimePicker
                        margin="normal"
                        ampm={false}
                        id="time-picker"
                        label="Heure de fin"
                        value={selectedDate}
                        onChange={handleDateChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={2} />
          </Grid>
        </MuiPickersUtilsProvider>
      </Box>
    </>
  );
};

export default ChallengeCreation;
