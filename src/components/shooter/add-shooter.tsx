import DateFnsUtils from '@date-io/date-fns';
import { fr } from 'date-fns/locale';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { CreateShooterRequest, getFullName, GetSearchShooterResponse } from 'services/models/shooter.model';
import React, { useEffect, useState } from 'react';
import { customTheme, dateTheme, debounceDefaultValue } from 'configurations/theme.configuration';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Link } from 'react-router-dom';
import { GetClubResponse } from 'services/models/club.model';
import { GetCategoryResponse } from 'services/models/category.model';
import ShooterService from 'services/shooter.service';
import { REGEXES } from 'App.constants';
import { GetCountryResponse } from 'services/models/country.model';
import { ToastVariant } from '../toast/toast';
import { formatDate } from 'utils/date.utils';
import debounce from '../../utils/debounce.utils';

type AddShooterProps = {
  clubs: GetClubResponse[];
  countries: GetCountryResponse[];
  categories: GetCategoryResponse[];
  filteredCategories?: GetCategoryResponse[];
  backRoute: string;
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
    addShooter: (callback: () => Promise<number>, firstname: string, lastname: string) => any
  };
};

const AddShooter = (props: AddShooterProps) => {

  const [searchName, setSearchName] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOptions, setSearchOptions] = useState<GetSearchShooterResponse[]>([]);
  const [categories, setCategories] = useState<GetCategoryResponse[]>([]);
  const [inputLastname, setLastname] = useState('');
  const [inputFirstname, setFirstname] = useState('');
  const [inputEmail, setEmail] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [birthdate, setBirthdate] = useState<Date | null>(null);

  const [lastnameValid, setLastnameValid] = useState(true);
  const [firsnameValid, setFirsnameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [categoryValid, setCategoryValid] = useState(true);
  const informationFormValid = ![!!inputLastname, !!inputFirstname, emailValid, !!selectedCategory].some(
    validation => !validation
  );

  useEffect(() => {
    if (searchName) {
      setSearchLoading(true);
      ShooterService.searchShooter(searchName)
        .then((searchResponse) => {
          setSearchLoading(false);
          setSearchOptions(searchResponse.data);
        })
        .catch(() => {
          setSearchLoading(false);
          props.actions.error(
            "Impossible de rechercher les tireurs"
          );
        });
    }
  }, [searchName]);

  useEffect(() => {
    if (props.filteredCategories) {
      setCategories(props.filteredCategories);
    } else {
      setCategories(props.categories);
    }
  }, []);

  let debounceFn: any;
  const handleSearchNameChange = (event: any) => {
    event.persist();
    if (!debounceFn) {
      debounceFn = debounce(() => {
        const newValue = event.target.value;
        setSearchName(newValue);
      }, debounceDefaultValue)
    }
    debounceFn(event);
  };

  const handleLastnameChange = (event: any) => {
    const newValue = event.target.value;
    setLastnameValid(!!newValue);
    setLastname(newValue);
  };

  const handleFirstnameChange = (event: any) => {
    const newValue = event.target.value;
    setFirsnameValid(!!newValue);
    setFirstname(newValue);
  };

  const handleEmailChange = (event: any) => {
    const newValue = event.target.value;
    setEmailValid(RegExp(REGEXES.EMAIL).test(newValue));
    setEmail(newValue);
  };

  const handleClubChange = (event: any) => {
    const newValue = event.target.value;
    setSelectedClub(newValue);
  };

  const handleCategoryChange = (event: any) => {
    const newValue = event.target.value;
    setCategoryValid(!!newValue);
    setSelectedCategory(newValue);
  };

  const handleSelected = (event: any, value: GetSearchShooterResponse) => {
    props.actions.addShooter(() => Promise.resolve(value.id), value.firstname, value.lastname);
  }

  const handleNext = () => {
    const datePayload = birthdate
      ? formatDate(birthdate, dateTheme.format.dateServer)
      : undefined;
    const categoryIdPayload = categories.find(category => category.label === selectedCategory)?.id ?? -1;
    const clubIdPayload = props.clubs.find(club => club.name === selectedClub)?.id ?? undefined;

    const shooterCreationPayload: CreateShooterRequest = {
      lastname: inputLastname,
      firstname: inputFirstname,
      clubId: clubIdPayload,
      categoryId: categoryIdPayload,
      birthdate: datePayload,
      email: inputEmail ? inputEmail : undefined
    };
    props.actions.addShooter(
      () => ShooterService.createShooter(shooterCreationPayload).then(response => response.data.id),
      inputFirstname,
      inputLastname
    )
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fr}>
      <form noValidate>
        <Box display="flex" justifyContent="center">
          <Box display="flex" flexDirection="column" width={0.8}>
            <Box pb={2}>
              <Typography variant="h6">RECHERCHER UN TIREUR EXISTANT</Typography>
            </Box>
            <Box pb={4}>
              <Autocomplete
                style={{ width: "50%" }}
                loadingText="Recherche en cours..."
                noOptionsText="Aucun tireur trouvé"
                open={searchOpen}
                onOpen={() => {
                  setSearchOpen(true);
                }}
                onClose={() => {
                  setSearchOpen(false);
                }}
                onChange={handleSelected}
                onInputChange={handleSearchNameChange}
                getOptionSelected={(option: GetSearchShooterResponse, value: GetSearchShooterResponse) => getFullName(option) === getFullName(value)}
                getOptionLabel={(option: GetSearchShooterResponse) => `${getFullName(option)}`}
                options={searchOptions}
                loading={searchLoading}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Rechercher par nom et prénom"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {searchLoading ? <CircularProgress color="secondary" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Box>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h6">OU INSCRIRE UN NOUVEAU TIREUR</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Informations générales</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  error={!lastnameValid}
                  fullWidth
                  required
                  label="Nom"
                  onChange={handleLastnameChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  error={!firsnameValid}
                  fullWidth
                  required
                  label="Prénom"
                  onChange={handleFirstnameChange}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Club de rattachement</InputLabel>
                  <Select value={selectedClub} onChange={handleClubChange}>
                    {props.clubs.map(club => (
                      <MenuItem key={club.id} value={club.name}>
                        {club.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl required fullWidth error={!categoryValid}>
                  <InputLabel>Catégorie</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    renderValue={customTheme.selectSimpleRender}
                  >
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.label}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <DatePicker
                    disableFuture
                    placeholder="10/10/1990"
                    format={dateTheme.format.datePickers}
                    margin="normal"
                    id="birthdate-picker"
                    label="Date de naissance"
                    value={birthdate}
                    onChange={setBirthdate}
                    clearLabel={dateTheme.pickerLabels.clearLabel}
                    cancelLabel={dateTheme.pickerLabels.cancelLabel}
                    okLabel={dateTheme.pickerLabels.okLabel}
                    todayLabel={dateTheme.pickerLabels.todayLabel}
                    invalidDateMessage={dateTheme.pickerLabels.invalidDateMessage}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2">Informations de contact</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  error={!emailValid}
                  fullWidth
                  label="Email"
                  onChange={handleEmailChange}
                />
              </Grid>

              <Grid item container spacing={2} justify="flex-end" alignItems="center">
                <Grid item>
                  <Button
                    variant="outlined"
                    component={Link}
                    to={props.backRoute}
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
                    onClick={handleNext}
                  >
                    SUIVANT
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

export default AddShooter;
