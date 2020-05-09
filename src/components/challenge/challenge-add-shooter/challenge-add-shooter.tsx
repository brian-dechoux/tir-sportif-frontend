import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ROUTES } from 'configurations/server.configuration';
import { customTheme, paginationTheme } from 'configurations/theme.configuration';
import ClubService from 'services/club.service';
import CategoryService from 'services/category.service';
import DisciplineService from 'services/discipline.service';
import { GetClubResponse } from 'services/models/club.model';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import { GetCategoryResponse } from 'services/models/category.model';
import { ToastVariant } from 'components/toast/toast';
import { GetCountryResponse } from 'services/models/country.model';
import { DEFAULT_CLUB, DEFAULT_COUNTRY } from '../../../App.constants';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { formatString } from '../../../utils/date.utils';
import TableContainer from '@material-ui/core/TableContainer';
import { Participation } from '../../../services/models/participation.model';

type ChallengeCreationProps = {
  countries: GetCountryResponse[];
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const booleanToText = (bool: boolean) => (bool ? 'Oui' : 'Non');

const ChallengeAddShooter = (props: ChallengeCreationProps) => {
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
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [participations, setParticipations] = useState<Participation[]>([]);
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

  //TODO
  useEffect(() => {
    if (formSent) {
    }
  }, [formSent]);

  const [lastnameValid, setLastnameValid] = useState(true);
  const [firsnameValid, setFirsnameValid] = useState(true);
  const [categoryValid, setCategoryValid] = useState(true);
  const informationFormValid = ![!!inputLastname, !!inputFirstname, !!selectedCategory].some(
    validation => !validation
  );

  const [disciplinesValid, setDisciplinesValid] = useState(true);
  const disciplinesFormValid = disciplines.length > 0;

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
        electronic: newParticipationElectronic,
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
                    <Button variant="outlined" component={Link} to={ROUTES.CHALLENGE.LIST}>
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
                <Grid item>
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
                              {booleanToText(participation.electronic)}
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
                    <Button variant="outlined" component={Link} to={ROUTES.CHALLENGE.LIST}>
                      ANNULER
                    </Button>
                  </Grid>
                  <Grid>
                    <Button
                      disabled={!disciplinesFormValid}
                      variant="contained"
                      color="secondary"
                      type="button"
                      onClick={() => {
                        setDisplayInformationForm(false);
                        setDisplayDisciplinesForm(true);
                      }}
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
