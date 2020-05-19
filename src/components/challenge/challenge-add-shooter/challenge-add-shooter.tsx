import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ROUTES } from 'configurations/server.configuration';
import { customTheme, dateTheme } from 'configurations/theme.configuration';
import ClubService from 'services/club.service';
import CategoryService from 'services/category.service';
import DisciplineService from 'services/discipline.service';
import { GetClubResponse } from 'services/models/club.model';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import { GetCategoryResponse } from 'services/models/category.model';
import { ToastVariant } from 'components/toast/toast';
import { GetCountryResponse } from 'services/models/country.model';
import TableContainer from '@material-ui/core/TableContainer';
import {
  CreateDisciplineParticipationRequest,
  CreateParticipationsRequest,
  Participation,
} from 'services/models/challenge.model';
import ChallengeService from 'services/challenge.service';
import { CreateShooterRequest } from 'services/models/shooter.model';
import DateFnsUtils from '@date-io/date-fns';
import { fr } from 'date-fns/locale';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { formatDate } from 'utils/date.utils';
import ShooterService from 'services/shooter.service';

type ChallengeAddShooterProps = {
  challengeId: number;
  countries: GetCountryResponse[];
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const booleanToText = (bool: boolean) => (bool ? 'Oui' : 'Non');

const ChallengeAddShooter = (props: ChallengeAddShooterProps) => {
  const [formSent, setFormSent] = useState(false);

  const [displayInformationForm, setDisplayInformationForm] = useState(true);
  const [displayDisciplinesForm, setDisplayDisciplinesForm] = useState(false);

  const [clubs, setClubs] = useState<GetClubResponse[]>([]);
  const [categories, setCategories] = useState<GetCategoryResponse[]>([]);
  const [disciplines, setDisciplines] = useState<GetDisciplineResponse[]>([]);
  const [availableDisciplines, setAvailableDisciplines] = useState<GetDisciplineResponse[]>([]);

  const [inputLastname, setLastname] = useState('');
  const [inputFirstname, setFirstname] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [inputAddressNumber, setAddressNumber] = useState('');
  const [inputAddressStreet, setAddressStreet] = useState('');
  const [inputAddressZip, setAddressZip] = useState('');
  const [inputAddressCity, setAddressCity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    let unmounted = false;
    if (clubs.length === 0 && categories.length === 0 && disciplines.length === 0) {
      Promise.all([
        ChallengeService.getChallenge(props.challengeId),
        ClubService.getClubs(),
        CategoryService.getCategories(),
        DisciplineService.getDisciplines(),
      ])
        .then(([challengeResponse, clubsResponse, categoriesResponse, disciplinesResponse]) => {
          if (!unmounted) {
            setClubs(clubsResponse.data);
            setCategories(categoriesResponse.data);
            setDisciplines(disciplinesResponse.data);
            setAvailableDisciplines(disciplinesResponse.data);
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

  useEffect(() => {
    if (formSent) {
      const datePayload = birthdate
        ? formatDate(birthdate, dateTheme.format.dateTimeServer)
        : undefined;
      // FIXME -1 or 0 stuff -> Select properly
      const categoryIdPayload = categories.find(category => category.label === selectedCategory) ?.id ?? -1;
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
      ShooterService.createShooter(shooterCreationPayload)
        .then(response => {
          if (response.status === 201) {
            const createdShooterId = response.data.id;
            const participationsPayload: CreateDisciplineParticipationRequest[] = participations.map(
              participation => ({
                // FIXME -1 -> Select properly
                disciplineId: disciplines.find(discipline => discipline.label === participation.discipline)?.id ?? -1,
                useElectronicTarget: participation.useElectronicTarget,
                paid: participation.paid,
                outrank: participation.outrank,
              })
            );
            const createParticipationsPayload: CreateParticipationsRequest = {
              shooterId: createdShooterId,
              disciplinesInformation: participationsPayload,
            };
            return ChallengeService.createParticipations(
              props.challengeId,
              createParticipationsPayload
            ).then(response => {
              if (response.status === 201) {
                props.actions.openToast('La tireur a été inscrit au challenge', 'success');
                props.actions.push(`${ROUTES.CHALLENGE.LIST}/${props.challengeId}`);
              } else {
                throw new Error();
              }
            });
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          props.actions.error("Impossible d'inscrire le tireur");
          setFormSent(false);
        });
    }
  }, [formSent]);

  const [lastnameValid, setLastnameValid] = useState(true);
  const [firsnameValid, setFirsnameValid] = useState(true);
  const [categoryValid, setCategoryValid] = useState(true);
  const informationFormValid = ![!!inputLastname, !!inputFirstname, !!selectedCategory].some(
    validation => !validation
  );

  const [disciplinesValid, setDisciplinesValid] = useState(true);
  const disciplinesFormValid = participations.length > 0;

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

  const [newParticipationDiscipline, setNewParticipationDiscipline] = useState<string>('');
  const [newParticipationElectronic, setNewParticipationElectronic] = useState(false);
  const [newParticipationOutrank, setNewParticipationOutrank] = useState(false);
  const [newParticipationPaid, setNewParticipationPaid] = useState(false);
  const participationDialogFormValid = !!newParticipationDiscipline;

  const handleNewParticipationDisciplineChange = (event: any) => {
    const newValue = event.target.value;
    setNewParticipationDiscipline(newValue);
  };

  const handleNewParticipationCreation = () => {
    if (newParticipationDiscipline) {
      const newParticipation: Participation = {
        discipline: newParticipationDiscipline,
        useElectronicTarget: newParticipationElectronic,
        outrank: newParticipationOutrank,
        paid: newParticipationPaid,
      };
      setDisciplinesValid(true);
      setParticipations([...participations, newParticipation]);
      setAvailableDisciplines(
        availableDisciplines.filter(
          availableDiscipline => availableDiscipline.label !== newParticipationDiscipline
        )
      );
      setNewParticipationDiscipline('');
      setNewParticipationElectronic(false);
      setNewParticipationOutrank(false);
      setNewParticipationPaid(false);
    }
    setOpen(false);
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
            >
              RETOUR
            </Button>
          </Box>
          <Box display="flex" justifyContent="center" pt={2}>
            <Box display="flex" width={0.6}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="h6">
                    AJOUTER LES DISCIPLINES À L'INSCRIPTION DU TIREUR
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    disabled={availableDisciplines.length === 0}
                    variant="contained"
                    color="secondary"
                    onClick={handleClickOpen}
                  >
                    AJOUTER
                  </Button>

                  <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
                    <DialogTitle>AJOUTER UNE DISCIPLINE</DialogTitle>
                    <DialogContent>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={12}>
                          <FormControl required fullWidth error={!disciplinesValid}>
                            <InputLabel>Discipline</InputLabel>
                            <Select
                              value={newParticipationDiscipline}
                              onChange={handleNewParticipationDisciplineChange}
                              renderValue={customTheme.selectSimpleRender}
                            >
                              {availableDisciplines.map(discipline => (
                                <MenuItem key={discipline.id} value={discipline.label}>
                                  {discipline.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={newParticipationElectronic}
                                  onChange={() =>
                                    setNewParticipationElectronic(!newParticipationElectronic)
                                  }
                                  color="primary"
                                />
                              }
                              label="CIBLE ÉLECTRONIQUE"
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={4}>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={newParticipationOutrank}
                                  onChange={() =>
                                    setNewParticipationOutrank(!newParticipationOutrank)
                                  }
                                  color="primary"
                                />
                              }
                              label="HORS CLASSEMENT"
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={4}>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={newParticipationPaid}
                                  onChange={() => setNewParticipationPaid(!newParticipationPaid)}
                                  color="primary"
                                />
                              }
                              label="A PAYÉ"
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button variant="outlined" onClick={handleClose}>
                        ANNULER
                      </Button>
                      <Button
                        disabled={!participationDialogFormValid}
                        onClick={handleNewParticipationCreation}
                        variant="contained"
                        color="secondary"
                      >
                        AJOUTER
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
                <Grid item xs={10}>
                  <Box fontStyle="italic">
                    <Typography variant="body2" hidden={availableDisciplines.length > 0}>
                      * Le tireur est inscrit à toutes les disciplines proposées par le challenge
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table stickyHeader>
                      <colgroup>
                        <col width={0.3} />
                        <col width={0.2} />
                        <col width={0.2} />
                        <col width={0.2} />
                        <col width={0.1} />
                      </colgroup>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">DISCIPLINE</TableCell>
                          <TableCell align="center">CIBLE ÉLECTRONIQUE</TableCell>
                          <TableCell align="center">HORS CLASSEMENT</TableCell>
                          <TableCell align="center">A PAYÉ</TableCell>
                          <TableCell />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {participations.map(participation => (
                          <TableRow key={participation.discipline}>
                            <TableCell align="center">{participation.discipline}</TableCell>
                            <TableCell align="center">
                              {booleanToText(participation.useElectronicTarget)}
                            </TableCell>
                            <TableCell align="center">
                              {booleanToText(participation.outrank)}
                            </TableCell>
                            <TableCell align="center">
                              {booleanToText(participation.paid)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
                      disabled={!disciplinesFormValid}
                      variant="contained"
                      color="secondary"
                      type="button"
                      onClick={() => setFormSent(true)}
                    >
                      VALIDER L'INSCRIPTION
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </form>
      );
    } else {
      return null;
    }
  }
};

export default ChallengeAddShooter;
