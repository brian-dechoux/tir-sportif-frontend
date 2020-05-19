import React, { useEffect, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { CreateAddressRequest } from 'services/models/address.model';
import { Link } from 'react-router-dom';
import { ROUTES } from 'configurations/server.configuration';
import { fr } from 'date-fns/locale';
import { customTheme, dateTheme } from 'configurations/theme.configuration';
import ChallengeService from 'services/challenge.service';
import ClubService from 'services/club.service';
import CategoryService from 'services/category.service';
import DisciplineService from 'services/discipline.service';
import { GetClubResponse } from 'services/models/club.model';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import { GetCategoryResponse } from 'services/models/category.model';
import { ToastVariant } from 'components/toast/toast';
import { GetCountryResponse } from 'services/models/country.model';
import { DEFAULT_CLUB, DEFAULT_COUNTRY } from '../../../App.constants';

type ChallengeCreationProps = {
  countries: GetCountryResponse[];
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ChallengeCreation = (props: ChallengeCreationProps) => {
  const [formSent, setFormSent] = useState(false);

  const [clubs, setClubs] = useState<GetClubResponse[]>([]);
  const [categories, setCategories] = useState<GetCategoryResponse[]>([]);
  const [disciplines, setDisciplines] = useState<GetDisciplineResponse[]>([]);

  const [inputName, setName] = useState('');
  const [selectedClub, setSelectedClub] = useState(DEFAULT_CLUB.name);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [inputAddressNumber, setAddressNumber] = useState<string>('');
  const [inputAddressStreet, setAddressStreet] = useState<string>('');
  const [inputAddressZip, setAddressZip] = useState<string>('');
  const [inputAddressCity, setAddressCity] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY.name);

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
              "Impossible de récupérer les listes d'information nécessaires à la création d'un challenge"
            );
          }
        });
    }
    return () => {
      unmounted = true;
    };
  }, [clubs, categories, disciplines]);

  useEffect(() => {
    if (formSent) {
      const clubPayload = clubs.find(club => club.name === selectedClub);
      const datePayload = selectedDateTime ? selectedDateTime : new Date();
      const categoriesPayload = categories
        .filter(category =>
          selectedCategories.some(selectedCategory => selectedCategory === category.label)
        )
        .map(category => category.id);
      const disciplinesPayload = disciplines
        .filter(discipline =>
          selectedDisciplines.some(selectedDiscipline => selectedDiscipline === discipline.label)
        )
        .map(discipline => discipline.id);
      const addressPayload: CreateAddressRequest = {
        number: inputAddressNumber === '' ? undefined : inputAddressNumber,
        street: inputAddressStreet,
        zip: inputAddressZip === '' ? undefined : inputAddressZip,
        city: inputAddressCity,
        countryId:
          props.countries.find(country => country.name === selectedCountry)?.id ??
          DEFAULT_COUNTRY.id,
      };
      ChallengeService.createChallenge(
        inputName,
        addressPayload,
        datePayload,
        clubPayload?.id ?? DEFAULT_CLUB.id,
        categoriesPayload,
        disciplinesPayload
      )
        .then(response => {
          if (response.status === 201) {
            props.actions.openToast('Challenge créé avec succès', 'success');
            props.actions.push(ROUTES.CHALLENGE.LIST);
          } else {
            props.actions.error('Impossible de créer le challenge');
          }
        })
        .catch(() => {
          props.actions.error('Impossible de créer le challenge');
          setFormSent(false);
        });
    }
  }, [formSent]);

  const [challengeNameValid, setChallengeNameValid] = useState(true);
  const [categoriesValid, setCategoriesValid] = useState(true);
  const [disciplinesValid, setDisciplinesValid] = useState(true);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [addressStreetValid, setAddressStreetValid] = useState(true);
  const [addressCityValid, setAddressCityValid] = useState(true);

  const formValid = ![
    challengeNameValid,
    !!selectedDateTime,
    !!selectedClub,
    selectedCategories.length > 0,
    selectedDisciplines.length > 0,
    addressStreetValid,
    addressCityValid,
    !!selectedCountry,
  ].some(validation => !validation);

  const handleNameChange = (event: any) => {
    const newValue = event.target.value;
    setChallengeNameValid(!!newValue);
    setName(newValue);
  };

  const handleStreetChange = (event: any) => {
    const newValue = event.target.value;
    setAddressStreetValid(!!newValue);
    setAddressStreet(newValue);
  };

  const handleCityChange = (event: any) => {
    const newValue = event.target.value;
    setAddressCityValid(!!newValue);
    setAddressCity(newValue);
  };

  const handleCountryChange = (event: any) => {
    const newValue = event.target.value;
    setSelectedCountry(newValue);
  };

  const handleClubChange = (event: any) => {
    const newValue = event.target.value;
    setSelectedClub(newValue);
  };

  const handleCategoriesChange = (event: any) => {
    const newValue = event.target.value;
    setCategoriesValid(newValue.length > 0);
    setSelectedCategories(newValue);
  };

  const handleDisciplinesChange = (event: any) => {
    const newValue = event.target.value;
    setDisciplinesValid(newValue.length > 0);
    setSelectedDisciplines(newValue);
  };

  if (clubs.length === 0 || categories.length === 0 || disciplines.length === 0) {
    // TODO spinner (with message ?)
    return null;
  } else {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fr}>
        <form noValidate>
          <Box display="flex" justifyContent="center">
            <Box display="flex" width={0.6}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="h6">CRÉER UN CHALLENGE</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Informations générales</Typography>
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
                        <MenuItem key={club.id} value={club.name}>
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
                      format={dateTheme.format.dateTimePickers}
                      margin="normal"
                      ampm={false}
                      id="datetime-picker"
                      label="Date et heure du challenge"
                      value={selectedDateTime}
                      onChange={setSelectedDateTime}
                      clearLabel={dateTheme.pickerLabels.clearLabel}
                      cancelLabel={dateTheme.pickerLabels.cancelLabel}
                      okLabel={dateTheme.pickerLabels.okLabel}
                      todayLabel={dateTheme.pickerLabels.todayLabel}
                      invalidDateMessage={dateTheme.pickerLabels.invalidDateMessage}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Lieu</Typography>
                </Grid>
                <Grid item md={3}>
                  <TextField fullWidth label="Numéro" onChange={(event: any) => setAddressNumber(event.target.value)} />
                </Grid>
                <Grid item md={9}>
                  <TextField required fullWidth label="Rue" onChange={handleStreetChange} />
                </Grid>
                <Grid item md={3}>
                  <TextField fullWidth label="Code postal" onChange={(event: any) => setAddressZip(event.target.value)} />
                </Grid>
                <Grid item md={6}>
                  <TextField required fullWidth label="Ville" onChange={handleCityChange} />
                </Grid>
                <Grid item md={3}>
                  <FormControl required fullWidth>
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
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Informations sportives</Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormControl required fullWidth error={!categoriesValid}>
                    <InputLabel>Catégories</InputLabel>
                    <Select
                      multiple
                      value={selectedCategories}
                      onChange={handleCategoriesChange}
                      renderValue={customTheme.selectMultipleRender}
                    >
                      {categories.map(category => (
                        <MenuItem key={category.id} value={category.label}>
                          <Checkbox
                            checked={selectedCategories.some(
                              selectedCategory => selectedCategory === category.label
                            )}
                          />
                          <ListItemText primary={category.label} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl required fullWidth error={!disciplinesValid}>
                    <InputLabel>Disciplines</InputLabel>
                    <Select
                      multiple
                      value={selectedDisciplines}
                      onChange={handleDisciplinesChange}
                      renderValue={customTheme.selectMultipleRender}
                    >
                      {disciplines.map(discipline => (
                        <MenuItem key={discipline.id} value={discipline.label}>
                          <Checkbox
                            checked={selectedDisciplines.some(
                              selectedDiscipline => selectedDiscipline === discipline.label
                            )}
                          />
                          <ListItemText primary={discipline.label} />
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
        </form>
      </MuiPickersUtilsProvider>
    );
  }
};

export default ChallengeCreation;
