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
import { dateTheme } from 'configurations/theme.configuration';
import ChallengeService from 'services/challenge.service';
import ClubService from 'services/club.service';
import CategoryService from 'services/category.service';
import DisciplineService from 'services/discipline.service';
import { GetClubResponse } from 'services/models/club.model';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import { GetCategoryResponse } from 'services/models/category.model';
import { ToastVariant } from 'components/toast/toast';

type ChallengeCreationProps = {
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const DEFAULT_CLUB = {
  id: 1,
  name: 'ST Club Briey',
};

const DEFAULT_ADDRESS: CreateAddressRequest = {
  street: 'Rue de Dolhain',
  city: 'Val de Briey',
  countryId: 74,
};

// TODO BDX Extract in theme
const selectMultipleRender = (selected: any) => (selected as string[]).join(', ');

const ChallengeCreation = (props: ChallengeCreationProps) => {
  const [formSent, setFormSent] = useState(false);

  const [clubs, setClubs] = useState<GetClubResponse[]>([]);
  const [categories, setCategories] = useState<GetCategoryResponse[]>([]);
  const [disciplines, setDisciplines] = useState<GetDisciplineResponse[]>([]);

  const [inputName, setName] = useState('');
  const [selectedClub, setSelectedClub] = useState(DEFAULT_CLUB.name);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);

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
      ChallengeService.createChallenge(
        inputName,
        DEFAULT_ADDRESS,
        datePayload,
        clubPayload ? clubPayload.id : DEFAULT_CLUB.id,
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
          props.actions.error('Impossible de créer le challenge')
          setFormSent(false);
        });
    }
  }, [formSent]);

  const [challengeNameValid, setChallengeNameValid] = useState(true);
  const [categoriesValid, setCategoriesValid] = useState(true);
  const [disciplinesValid, setDisciplinesValid] = useState(true);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  const formValid = ![
    challengeNameValid,
    !!selectedDateTime,
    !!selectedClub,
    selectedCategories.length > 0,
    selectedDisciplines.length > 0,
  ].some(validation => !validation);

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
    setCategoriesValid(newValue.length > 0);
    setSelectedCategories(newValue);
  };

  const handleDisciplinesChange = (event: any) => {
    const newValue = event.target.value;
    setDisciplinesValid(newValue.length > 0);
    setSelectedDisciplines(newValue);
  };

  if (clubs.length === 0 || categories.length === 0 || disciplines.length === 0) {
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
                      format={dateTheme.format.pickers}
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
                <Grid item xs={6}>
                  <FormControl required fullWidth error={!categoriesValid}>
                    <InputLabel>Catégories</InputLabel>
                    <Select
                      multiple
                      value={selectedCategories}
                      onChange={handleCategoriesChange}
                      renderValue={selectMultipleRender}
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
                      renderValue={selectMultipleRender}
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
