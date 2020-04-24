import React, { useEffect, useState } from 'react';
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
import ChallengeService from 'services/challenge.service';
import ClubService from 'services/club.service';
import CategoryService from 'services/category.service';
import DisciplineService from 'services/discipline.service';
import { GetClubResponse } from 'services/models/club.model';
import { GetDisciplineResponse } from '../../../services/models/discipline.model';
import { GetCategoryResponse } from '../../../services/models/category.model';

type ChallengeCreationProps = {
  actions: {
    error: (message: string) => ThunkAction<void, AppState, undefined, any>;
    push: (
      path: string,
      state?: any | undefined
    ) => CallHistoryMethodAction<[string, (any | undefined)?]>;
  };
};

const DEFAULT_CLUB = {
  id: 1,
  name: 'ST Club Briey',
};

// TODO BDX Extract in theme
const selectMultipleRender = (selected: any) => (selected as string[]).join(', ');

const ChallengeCreation = (props: ChallengeCreationProps) => {
  const [clubs, setClubs] = useState<GetClubResponse[]>([]);
  const [categories, setCategories] = useState<GetCategoryResponse[]>([]);
  const [disciplines, setDisciplines] = useState<GetDisciplineResponse[]>([]);
  const [selectedClub, setSelectedClub] = useState(DEFAULT_CLUB.id);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState<number[]>([]);

  useEffect(() => {
    let unmounted = false;
    if (clubs.length === 0 && categories.length === 0 && disciplines.length === 0) {
      Promise.all([
        ClubService.getClubs(),
        CategoryService.getCategories(),
        DisciplineService.getDisciplines(),
      ])
        .then(([clubsResponse, categoriesResponse, disciplinesResponse]) => {
          if (!unmounted) {
            setClubs(clubsResponse.data);
            setCategories(categoriesResponse.data);
            setDisciplines(disciplinesResponse.data);
          }
        })
        .catch(() => {
          if (!unmounted) {
            props.actions.error(
              "Impossible de récupérer les listes d'information nécessaire à la création d'un challenge"
            );
          }
        });
    }
    return () => {
      unmounted = true;
    };
  }, [clubs, categories, disciplines, props.actions]);

  const [challengeNameValid, setChallengeNameValid] = useState(true);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [inputName, setName] = useState('');

  const formValid = ![challengeNameValid, !!selectedDateTime, !!selectedClub].some(
    validation => !validation
  );

  const handleNameChange = (event: any) => {
    const newValue = event.target.value;
    setChallengeNameValid(!!newValue);
    setName(newValue);
  };

  const handleClubChange = (event: any) => {
    const newValue = event.target.value;
    setSelectedClub(newValue);
  };

  const handleCategoriesChange = (event: any) => {
    const newValue = event.target.value;
    setSelectedCategories([...selectedCategories, newValue]);
  };

  const handleDisciplinesChange = (event: any) => {
    const newValue = event.target.value;
    setSelectedDisciplines([...selectedDisciplines, newValue]);
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

  if (clubs.length === 0) {
    return null;
  } else {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fr}>
        <form onSubmit={handleChallengeCreation} noValidate>
          <Box display="flex" justifyContent="center">
            <Box display="flex" width={0.6}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="h6">CRÉER UN CHALLENGE</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    error={!challengeNameValid}
                    fullWidth
                    required
                    label="Nom du challenge"
                    onChange={handleNameChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl required fullWidth>
                    <InputLabel>Club organisateur</InputLabel>
                    <Select value={selectedClub} onChange={handleClubChange}>
                      {clubs.map(club => (
                        <MenuItem key={club.id} value={club.id}>
                          {club.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                <Grid item xs={6}>
                  <FormControl required fullWidth>
                    <InputLabel>Catégories</InputLabel>
                    <Select
                      multiple
                      value={selectedCategories}
                      onChange={handleCategoriesChange}
                      renderValue={selectMultipleRender}
                    >
                      {categories.map(category => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl required fullWidth>
                    <InputLabel>Disciplines</InputLabel>
                    <Select
                      multiple
                      value={selectedDisciplines}
                      onChange={handleDisciplinesChange}
                      renderValue={selectMultipleRender}
                    >
                      {disciplines.map(discipline => (
                        <MenuItem key={discipline.id} value={discipline.id}>
                          {discipline.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item container spacing={2} justify="flex-end" alignItems="center">
                  <Grid item>
                    <Button variant="outlined" component={Link} to={ROUTES.CHALLENGE.LIST}>
                      ANNULER
                    </Button>
                  </Grid>
                  <Grid>
                    <Button
                      disabled={!formValid}
                      variant="contained"
                      color="secondary"
                      type="submit"
                    >
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
  }
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
