import React, { useEffect, useState } from 'react';
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
import { Link } from 'react-router-dom';
import { ROUTES } from 'configurations/server.configuration';
import { customTheme, dateTheme } from 'configurations/theme.configuration';
import { GetClubResponse } from 'services/models/club.model';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import { GetCategoryResponse } from 'services/models/category.model';
import { ToastVariant } from 'components/toast/toast';
import { GetCountryResponse } from 'services/models/country.model';
import { CreateShooterRequest } from 'services/models/shooter.model';
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
  const [displayInformationForm, setDisplayInformationForm] = useState(true);
  const [displayDisciplinesForm, setDisplayDisciplinesForm] = useState(false);

  const [clubs, setClubs] = useState<GetClubResponse[]>([]);
  const [categories, setCategories] = useState<GetCategoryResponse[]>([]);
  const [disciplines, setDisciplines] = useState<GetDisciplineResponse[]>([]);

  const [inputLastname, setLastname] = useState('');
  const [inputFirstname, setFirstname] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [inputAddressNumber, setAddressNumber] = useState('');
  const [inputAddressStreet, setAddressStreet] = useState('');
  const [inputAddressZip, setAddressZip] = useState('');
  const [inputAddressCity, setAddressCity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  // TODO Use properly Select to handle JSON, instead of direct string
  //  It will avoid useless array checks afterwards
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

  const callbackFn = () => {
    const datePayload = birthdate
      ? formatDate(birthdate, dateTheme.format.dateTimeServer)
      : undefined;
    // FIXME -1 or 0 stuff -> Select properly
    const categoryIdPayload = categories.find(category => category.label === selectedCategory)?.id ?? -1;
    const clubIdPayload = clubs.find(club => club.name === selectedClub)?.id ?? undefined;
    const addressPayload = (inputAddressStreet && inputAddressCity && selectedCountry) ? {
        number: inputAddressNumber,
        street: inputAddressStreet,
        zip: inputAddressZip,
        city: inputAddressCity,
        countryId: props.countries.find(club => club.name === selectedClub)?.id ?? -1,
      }
      : undefined;
    const shooterCreationPayload: CreateShooterRequest = {
      lastname: inputLastname,
      firstname: inputFirstname,
      clubId: clubIdPayload,
      categoryId: categoryIdPayload,
      birthdate: datePayload,
      address: addressPayload,
    };
    return ShooterService.createShooter(shooterCreationPayload).then(response => {
      if (response.status === 201) {
        return response.data.id;
      } else {
        throw new Error();
      }
    });
  }

  const [lastnameValid, setLastnameValid] = useState(true);
  const [firsnameValid, setFirsnameValid] = useState(true);
  const [categoryValid, setCategoryValid] = useState(true);
  const informationFormValid = ![!!inputLastname, !!inputFirstname, !!selectedCategory].some(
    validation => !validation
  );

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

  const handleClubChange = (event: any) => {
    const newValue = event.target.value;
    setSelectedClub(newValue);
  };

  const handleCategoryChange = (event: any) => {
    const newValue = event.target.value;
    setCategoryValid(!!newValue);
    setSelectedCategory(newValue);
  };

  if (clubs.length === 0 || categories.length === 0 || disciplines.length === 0) {
    // TODO spinner (with message ?)
    return null;
  } else {
    if (displayInformationForm) {
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fr}>
          <form noValidate>
            <Box display="flex" justifyContent="center">
              <Box display="flex" width={0.6}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12}>
                    <Typography variant="h6">INSCRIRE UN TIREUR</Typography>
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
                        onClick={() => {
                          setDisplayInformationForm(false);
                          setDisplayDisciplinesForm(true);
                        }}
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
