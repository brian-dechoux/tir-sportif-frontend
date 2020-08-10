import React, { useEffect, useState } from 'react';
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
import { Link } from 'react-router-dom';
import { ROUTES } from 'configurations/server.configuration';
import { customTheme, dateTheme } from 'configurations/theme.configuration';
import { GetClubResponse } from 'services/models/club.model';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import { GetCategoryResponse } from 'services/models/category.model';
import { ToastVariant } from 'components/toast/toast';
import { GetCountryResponse } from 'services/models/country.model';
import { CreateShooterRequest, getFullName, GetSearchShooterResponse } from 'services/models/shooter.model';
import DateFnsUtils from '@date-io/date-fns';
import { fr } from 'date-fns/locale';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { formatDate } from 'utils/date.utils';
import ShooterService from 'services/shooter.service';
import ChallengeDisciplineParticipation from '../challenge-discipline-participation/challenge-discipline-participation';
import ChallengeService from 'services/challenge.service';
import ClubService from 'services/club.service';
import CategoryService from 'services/category.service';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { REGEXES } from '../../../App.constants';
import { Autocomplete } from '@material-ui/lab';

type ChallengeAddShooterProps = {
  challengeId: number;
  countries: GetCountryResponse[];
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

// FIXME use challenge categories ?
const ChallengeAddShooter = (props: ChallengeAddShooterProps) => {
  const [searchName, setSearchName] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOptions, setSearchOptions] = useState<GetSearchShooterResponse[]>([]);
  const [selectedShooter, setSelectedShooter] = useState<GetSearchShooterResponse>();

  const [displayInformationForm, setDisplayInformationForm] = useState(true);
  const [displayDisciplinesForm, setDisplayDisciplinesForm] = useState(false);

  const [clubs, setClubs] = useState<GetClubResponse[]>([]);
  const [categories, setCategories] = useState<GetCategoryResponse[]>([]);
  const [disciplines, setDisciplines] = useState<GetDisciplineResponse[]>([]);

  const [inputLastname, setLastname] = useState('');
  const [inputFirstname, setFirstname] = useState('');
  const [inputEmail, setEmail] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [birthdate, setBirthdate] = useState<Date | null>(null);

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
    let unmounted = false;
    if (clubs.length === 0 && categories.length === 0 && disciplines.length === 0) {
      Promise.all([
        ChallengeService.getChallenge(props.challengeId),
        ClubService.getClubs(),
        CategoryService.getCategories(),
      ])
        .then(([challengeResponse, clubsResponse, categoriesResponse]) => {
          if (!unmounted) {
            setClubs(clubsResponse.data);
            setCategories(categoriesResponse.data);
            setDisciplines(challengeResponse.data.disciplines);
          }
        })
        .catch(() => {
          if (!unmounted) {
            props.actions.error(
              "Impossible de récupérer les listes d'information nécessaires à l'inscription d'un tireur"
            );
          }
        });
    }
    return () => {
      unmounted = true;
    };
  }, [clubs, categories, disciplines]);

  // FIXME Do backend side (1 call instead of 2 with logic in frontend)
  const callbackFn = () => {
    if (selectedShooter) {
      return Promise.resolve(selectedShooter.id);
    } else {
      const datePayload = birthdate
        ? formatDate(birthdate, dateTheme.format.dateTimeServer)
        : undefined;
      const categoryIdPayload = categories.find(category => category.label === selectedCategory)?.id ?? -1;
      const clubIdPayload = clubs.find(club => club.name === selectedClub)?.id ?? undefined;

      const shooterCreationPayload: CreateShooterRequest = {
        lastname: inputLastname,
        firstname: inputFirstname,
        clubId: clubIdPayload,
        categoryId: categoryIdPayload,
        birthdate: datePayload,
        email: inputEmail ? inputEmail : undefined
      };
      return ShooterService.createShooter(shooterCreationPayload).then(response => response.data.id);
    }
  }

  const [lastnameValid, setLastnameValid] = useState(true);
  const [firsnameValid, setFirsnameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [categoryValid, setCategoryValid] = useState(true);
  const informationFormValid = ![!!inputLastname, !!inputFirstname, emailValid, !!selectedCategory].some(
    validation => !validation
  );

  const handleSearchNameChange = (event: any) => {
    const newValue = event.target.value;
    setSearchName(newValue);
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

  const handleSearchedShooterSelection = (event: any, value: GetSearchShooterResponse) => {
    setSelectedShooter(value);
    handleGoingNextStep();
  }

  const handleGoingNextStep = () => {
    setDisplayInformationForm(false);
    setDisplayDisciplinesForm(true);
  }

  if (clubs.length === 0 || categories.length === 0 || disciplines.length === 0) {
    return null;
  } else {
    if (displayInformationForm) {
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
                    onChange={handleSearchedShooterSelection}
                    onInputChange={handleSearchNameChange}
                    getOptionSelected={(option: GetSearchShooterResponse, value: GetSearchShooterResponse) => getFullName(option) === getFullName(value)}
                    getOptionLabel={(option: GetSearchShooterResponse) => `${getFullName(option)}${option.clubName ? ', Tireur pour le club: ' + option.clubName : ''}`}
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
                        {clubs.map(club => (
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
                        to={`${ROUTES.CHALLENGE.LIST}/${props.challengeId}`}
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
                        onClick={handleGoingNextStep}
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
    } else if (displayDisciplinesForm) {
      return (
        <form noValidate>
          <Box display="flex" width={1}>
            <Button
              variant="outlined"
              onClick={() => {
                setDisplayDisciplinesForm(false);
                setDisplayInformationForm(true);
              }}
              startIcon={<KeyboardBackspaceIcon />}
            >
              RETOUR
            </Button>
          </Box>
          <ChallengeDisciplineParticipation
            challengeId={props.challengeId}
            disciplines={disciplines}
            shooterFirstname={selectedShooter ? selectedShooter.firstname : inputFirstname}
            shooterLastname={selectedShooter ? selectedShooter.lastname : inputLastname}
            callbackShooterFn={callbackFn}
            actions={props.actions}
          />
        </form>
      );
    } else {
      return null;
    }
  }
}



export default ChallengeAddShooter;

/* FIXME will be used by Licensee creation form
const [inputAddressNumber, setAddressNumber] = useState('');
const [inputAddressStreet, setAddressStreet] = useState('');
const [inputAddressZip, setAddressZip] = useState('');
const [inputAddressCity, setAddressCity] = useState('');
const [selectedCountry, setSelectedCountry] = useState('');

const handleStreetChange = (event: any) => {
  const newValue = event.target.value;
  setAddressStreet(newValue);
};

const handleCityChange = (event: any) => {
  const newValue = event.target.value;
  setAddressCity(newValue);
};

const handleCountryChange = (event: any) => {
  const newValue = event.target.value;
  setSelectedCountry(newValue);
};

const addressPayload = (inputAddressStreet && inputAddressCity && selectedCountry) ? {
        number: inputAddressNumber,
        street: inputAddressStreet,
        zip: inputAddressZip,
        city: inputAddressCity,
        countryId: props.countries.find(club => club.name === selectedClub)?.id ?? -1,
      }
      : undefined;

<Grid item xs={12}>
  <Typography variant="subtitle2">Addresse</Typography>
</Grid>
<Grid item md={3}>
  <TextField
    fullWidth
    label="Numéro"
    onChange={(event: any) => setAddressNumber(event.target.value)}
  />
</Grid>
<Grid item md={9}>
  <TextField fullWidth label="Rue" onChange={handleStreetChange} />
</Grid>
<Grid item md={3}>
  <TextField
    fullWidth
    label="Code postal"
    onChange={(event: any) => setAddressZip(event.target.value)}
  />
</Grid>
<Grid item md={6}>
  <TextField fullWidth label="Ville" onChange={handleCityChange} />
</Grid>
<Grid item md={3}>
  <FormControl fullWidth>
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
 */
