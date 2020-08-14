import React, { useEffect, useState } from 'react';
import { Box, Button } from '@material-ui/core';
import { ROUTES } from 'configurations/server.configuration';
import { GetClubResponse } from 'services/models/club.model';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import { GetCategoryResponse } from 'services/models/category.model';
import { ToastVariant } from 'components/toast/toast';
import { GetCountryResponse } from 'services/models/country.model';
import ChallengeDisciplineParticipation from '../challenge-discipline-participation/challenge-discipline-participation';
import ChallengeService from 'services/challenge.service';
import ClubService from 'services/club.service';
import CategoryService from 'services/category.service';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import AddShooterContainer from '../../shooter/add-shooter.container';
import ChallengeDisciplineParticipationContainer
  from '../challenge-discipline-participation/challenge-discipline-participation.container';

type ChallengeAddShooterProps = {
  challengeId: number;
  countries: GetCountryResponse[];
  callbackShooterFn: () => Promise<number>;
  shooterFirstname: string;
  shooterLastname: string;
  shooterResolved: boolean;
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
    resetShooter: () => any;
  };
};

const ChallengeAddShooter = (props: ChallengeAddShooterProps) => {
  const [clubs, setClubs] = useState<GetClubResponse[]>([]);
  const [categories, setCategories] = useState<GetCategoryResponse[]>([]);
  const [disciplines, setDisciplines] = useState<GetDisciplineResponse[]>([]);

  useEffect(() => {
    let unmounted = false;
    if (clubs.length === 0 && categories.length === 0 && disciplines.length === 0) {
      Promise.all([
        ChallengeService.getChallenge(props.challengeId),
        ClubService.getClubs(),
        CategoryService.getCategories(),
      ])
        .then(([challengeResponse, clubsResponse]) => {
          if (!unmounted) {
            setClubs(clubsResponse.data);
            setCategories(challengeResponse.data.categories);
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

  if (clubs.length === 0 || categories.length === 0 || disciplines.length === 0) {
    return null;
  } else {
    if (!props.shooterResolved) {
      return (
        <AddShooterContainer
          clubs={clubs}
          filteredCategories={categories}
          filteredDisciplines={disciplines}
          backRoute={`${ROUTES.CHALLENGE.LIST}/${props.challengeId}`}
        />
      );
    } else {
      return (
        <form noValidate>
          <Box display="flex" width={1}>
            <Button
              variant="outlined"
              onClick={props.actions.resetShooter}
              startIcon={<KeyboardBackspaceIcon />}
            >
              RETOUR
            </Button>
          </Box>
          <ChallengeDisciplineParticipationContainer
            challengeId={props.challengeId}
            disciplines={disciplines}
          />
        </form>
      );
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
