import React, { useEffect, useState } from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormGroup,
  Grid, IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  OutlinedInput,
  Paper,
  Typography,
} from '@material-ui/core';
import { formatString } from 'utils/date.utils';
import { ROUTES } from 'configurations/server.configuration';
import { ChallengeResultResponse, GetChallengeResponse } from 'services/models/challenge.model';
import ChallengeService from 'services/challenge.service';
import { Link } from 'react-router-dom';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import FilterListIcon from '@material-ui/icons/FilterList';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { Option, OptionsList } from 'models/options-list.model';
import Desktop from '../../media/desktop';
import { makeStyles } from '@material-ui/core/styles';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { customTheme } from '../../../configurations/theme.configuration';
import debounce from '../../../utils/debounce.utils';
import Mobile from '../../media/mobile';

type ResultsChallengeProps = {
  challengeId: number,
  actions: {
    error: (message: string) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

enum FilterType {
  CATEGORIES = "Categories",
  DISCIPLINES = "Disciplines"
}

const getDialogIdForChallengeResultInformation = (resultInformation: ChallengeResultResponse) => `${resultInformation.categoryId}.${resultInformation.disciplineId}`;

const ResultsChallenge = (props: ResultsChallengeProps) => {
  const useStyles = makeStyles(theme => ({
    alternateColor: {
      "background": "white"
    },
    main: {
      background: customTheme.mainBackground,
    },
    customizeToolbar: {
      margin: 0,
      minHeight: 24,
      backgroundColor: 'orange'
    },
    fixedFooter: {
      width: '100%',
      position: 'fixed',
      bottom: 0,
    },
    overflow: {
      "overflow": "auto"
    },

    app: {
      "text-align": "center",
      display: "flex",
      "flex-direction": "column",
      height: "100%",
      "flex-wrap": "nowrap",
    },

    header: {
      "flex-shrink": 0,
      background: "blue",
    },

    content: {
      overflow: "auto",
      "flex-grow": 1,
      background: "red",
    },

    footer: {
      "flex-shrink": 0,
      background:"green",
    }
  }));
  const classes = useStyles();

  const [challengeInformation, setChallengeInformation] = useState<GetChallengeResponse>();
  const [resultsInformation, setResultsInformation] = useState<ChallengeResultResponse[]>([]);
  const [optionCategories, setOptionCategories] = useState<OptionsList>(OptionsList.fromLabels([], true));
  const [optionDisciplines, setOptionDisciplines] = useState<OptionsList>(OptionsList.fromLabels([], true));
  const [searchShooter, setSearchShooter] = useState<string>('');
  const [selectDeselectToggle, setSelectDeselectToggle] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [disciplinesOpen, setDisciplinesOpen] = useState(false);
  const [fullResultsDialogOpen, setFullResultsDialogOpen] = useState<string>();
  const [filterDialogOpen, setFilterDialogOpen] = useState<FilterType>();

  const handleCategoriesListFilterClick = () => {
    setCategoriesOpen(!categoriesOpen)
  }

  const handleDisciplinesListFilterClick = () => {
    setDisciplinesOpen(!disciplinesOpen)
  }

  const handleResultsDialogOpen = (id: string) => {
    setFullResultsDialogOpen(id)
  }

  const handleResultsDialogClose = () => {
    setFullResultsDialogOpen(undefined)
  }

  const handleFilterDialogOpen = (filterType: FilterType) => {
    setFilterDialogOpen(filterType)
  }

  const handleFilterDialogClose = () => {
    setFilterDialogOpen(undefined)
  }

  const handleCategoryChecked = (category: Option) => {
    const updatedCategories = optionCategories.toggleOptionWithLabel(category.optionLabel);
    setOptionCategories(updatedCategories);
  }

  const handleDisciplineChecked = (discipline: Option) => {
    const updatedDisciplines = optionDisciplines.toggleOptionWithLabel(discipline.optionLabel);
    setOptionDisciplines(updatedDisciplines);
  }

  let debounceFn: any;
  const handleSearchShooter = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.persist();
    if (!debounceFn) {
      debounceFn = debounce((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let target = event.target;
        const sanitizedShooterNamePart = event.target.value?.trim() ?? '';
        setSearchShooter(sanitizedShooterNamePart);
      }, 300);
    }
    debounceFn(event);
  }

  const handleSelectDeselect = () => {
    setOptionCategories(optionCategories.toggleAll(!selectDeselectToggle));
    setSelectDeselectToggle(!selectDeselectToggle);
  }

  useEffect(() => {
    let unmounted = false;
    ChallengeService.getChallengeResults(props.challengeId)
      .then(response => {
        if (!unmounted) {
          setChallengeInformation(response.data.challenge);
          setResultsInformation(response.data.challengeResults);
          setOptionCategories(OptionsList.fromLabels(response.data.challenge.categories.map(category => category.label), true));
          setOptionDisciplines(OptionsList.fromLabels(response.data.challenge.disciplines.map(discipline => discipline.label), true));
        }
      })
      .catch(() => {
        if (!unmounted) {
          props.actions.error('Impossible de récupérer les informations du challenge demandé');
        }
      });
    return () => {
      unmounted = true;
    };
  }, []);

  const fullResultsDialog = (resultInformation: ChallengeResultResponse, mobileDisplay: boolean) => {
    const dialogContent =
      <>
        <List component="div" dense>
          {
            resultInformation.results.map((singleResult, index) =>
              <ListItem key={`dialog.${singleResult.firstname}.${singleResult.lastname}`}>
                <ListItemAvatar>
                    <Typography variant="body1">
                      {index + 1}.
                    </Typography>
                  </ListItemAvatar>
                <ListItemText
                  primary={`${singleResult.firstname} ${singleResult.lastname}`}
                />
                <ListItemSecondaryAction>
                  {singleResult.participationTotalPoints}
                </ListItemSecondaryAction>
              </ListItem>
            )
          }
        </List>
        {
          !mobileDisplay ?
            <DialogActions>
              <Button onClick={handleResultsDialogClose} color="primary">
                FERMER
              </Button>
            </DialogActions>
            : null
        }
      </>
    return fullResultsDialogOpen === getDialogIdForChallengeResultInformation(resultInformation) ?
      <Dialog
        fullScreen={mobileDisplay}
        scroll={mobileDisplay ? "paper" : "body"}
        maxWidth="sm"
        fullWidth
        open={true}
        onClose={handleResultsDialogClose}
      >
        {
          mobileDisplay ?
            <Box display="flex" justifyContent="space-around">
              <Box display="flex" flexDirection="column">
                <Typography variant="h6">
                  Classement complet
                </Typography>
                <Typography variant="subtitle1">
                  {resultInformation.categoryLabel} {resultInformation.disciplineLabel}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleResultsDialogClose}
                >
                  <CloseIcon />
                </Button>
              </Box>
            </Box>
            : <DialogTitle>Classement complet</DialogTitle>
        }
        <DialogContent className={mobileDisplay ? classes.main : ""}>{dialogContent}</DialogContent>
      </Dialog>
      : null
  }

  const categoriesFilterList = <List component="div" dense>
    <ListItem
      button
      key='TOGGLE.ALL.CATEGORIES'
      onClick={handleSelectDeselect}
    >
      <ListItemIcon>
        <DoneAllIcon color={selectDeselectToggle ? 'primary' : 'secondary'}/>
      </ListItemIcon>
      <ListItemText primary={selectDeselectToggle ? 'TOUT DESÉLECTIONNER' : 'TOUT SÉLECTIONNER'}/>
    </ListItem>
    {
      optionCategories.elements.map(optionCategory =>
        <ListItem key={optionCategory.optionLabel}>
          <Checkbox
            size='small'
            checked={optionCategory.optionSelected}
            onChange={() => handleCategoryChecked(optionCategory)}
          />
          <ListItemText primary={optionCategory.optionLabel}/>
        </ListItem>
      )
    }
  </List>;

  const disciplinesFilterList = <List component="div" dense>
    {
      optionDisciplines.elements.map(optionDiscipline =>
        <ListItem key={optionDiscipline.optionLabel}>
          <FormGroup>
            <FormControl>
              <Checkbox
                size='small'
                checked={optionDiscipline.optionSelected}
                onChange={() => handleDisciplineChecked(optionDiscipline)}
              />
            </FormControl>
          </FormGroup>
          <ListItemText primary={optionDiscipline.optionLabel}/>
        </ListItem>
      )
    }
  </List>;

  const filtered = (resultsInformation: ChallengeResultResponse[]) => {
    return resultsInformation
      .filter(resultInformation =>
        searchShooter ?
          resultInformation.results.some(result => `${result.lastname}${result.firstname}`.toLowerCase().includes(searchShooter.toLowerCase()))
          : true
      ).filter(resultInformation => {
        return optionCategories.active(resultInformation.categoryLabel) &&
          optionDisciplines.active(resultInformation.disciplineLabel)
      })
  }

  const filterDialog = filterDialogOpen ?
      <Dialog
        fullScreen
        scroll={"paper"}
        maxWidth="sm"
        fullWidth
        open={true}
        onClose={handleFilterDialogClose}
      >
        <Box display="flex" justifyContent="space-around">
          <Box display="flex" flexDirection="column">
            <Typography variant="h6">
              Filtrer par
            </Typography>
            <Typography variant="subtitle1">
              {filterDialogOpen}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Button
              variant="outlined"
              size="small"
              onClick={handleFilterDialogClose}
            >
              <CloseIcon />
            </Button>
          </Box>
        </Box>
        <DialogContent className={classes.main}>
          {filterDialogOpen === FilterType.CATEGORIES ? categoriesFilterList : disciplinesFilterList}
        </DialogContent>
      </Dialog>
      : null;

  if (!challengeInformation) {
    // TODO spinner (with message?)
    return null;
  } else {
    return (
      <>
        <Desktop>
          <Box display="flex" width={1}>
            <Box>
              <Button
                variant="outlined"
                component={Link} to={ROUTES.RESULTS.LIST}
                startIcon={<KeyboardBackspaceIcon/>}
              >
                RETOUR
              </Button>
            </Box>
          </Box>
          <Box display="flex" justifyContent="center" pb={1}>
            <Box width={0.6}>
              <Grid container direction="column" alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Résultats: {challengeInformation.name}, à {challengeInformation.address.city}, le{' '}
                    {formatString(challengeInformation.startDate, "dd MMMM yyyy")}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Divider/>
          <Box pt={3}>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <Box height="100%">
                  <Paper elevation={1} style={{height: '100%'}}>
                    <List>
                      <ListItem key='search'>
                        <FormControl variant="outlined" color="secondary" fullWidth>
                          <OutlinedInput
                            labelWidth={0}
                            placeholder="Rechercher un tireur"
                            onChange={handleSearchShooter}
                            startAdornment={
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </ListItem>
                      <Divider />
                      <ListItem key='title'>
                        <ListItemIcon>
                          <FilterListIcon color='primary'/>
                        </ListItemIcon>
                        <ListItemText primary="FILTRER" />
                      </ListItem>
                      <ListItem button key='categories' onClick={handleCategoriesListFilterClick}>
                        <ListItemText primary="CATEGORIES" />
                        {categoriesOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse in={categoriesOpen} timeout="auto">
                        {categoriesFilterList}
                      </Collapse>
                      <ListItem button key='disciplines' onClick={handleDisciplinesListFilterClick}>
                        <ListItemText primary="DISCIPLINES" />
                        {disciplinesOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse in={disciplinesOpen} timeout="auto">
                        {disciplinesFilterList}
                      </Collapse>
                    </List>
                  </Paper>
                </Box>
              </Grid>
              <Grid item container xs={9} spacing={2}>
                {
                  filtered(resultsInformation)
                    .map(resultInformation =>
                      <Grid item key={`${resultInformation.categoryId}.${resultInformation.disciplineId}`} xs={4}>
                        <Card>
                          <CardHeader title={
                            <Typography variant="h6">
                              {`${resultInformation.categoryLabel} ${resultInformation.disciplineLabel}`}
                            </Typography>
                          }/>
                          <CardContent>
                            <List component="div" dense>
                              {
                                resultInformation.results.slice(0,3).map((singleResult, index) =>
                                  <ListItem key={`${singleResult.firstname}.${singleResult.lastname}`}>
                                    <ListItemText primary={
                                      <Typography variant="body2" noWrap>
                                        {index + 1}. {singleResult.firstname} {singleResult.lastname}
                                      </Typography>
                                    }/>
                                    <ListItemSecondaryAction>{singleResult.participationTotalPoints}</ListItemSecondaryAction>
                                  </ListItem>
                                )
                              }
                            </List>
                          </CardContent>
                          {
                            resultInformation.results.length > 3 ?
                              <CardActions>
                                <Button
                                  size="small"
                                  startIcon={<FormatListNumberedIcon/>}
                                  onClick={() => handleResultsDialogOpen(getDialogIdForChallengeResultInformation(resultInformation))}
                                >
                                  CLASSEMENT COMPLET
                                </Button>
                              </CardActions>
                              : null
                          }
                          {fullResultsDialog(resultInformation, false)}
                        </Card>
                      </Grid>
                    )
                }
              </Grid>
            </Grid>
          </Box>
        </Desktop>
        <Mobile>
          <Box height="100%" display="flex" flexDirection="column" flexWrap="none">
            <Paper elevation={2}>
              <Box flexShrink={0} pt={1} pb={1}>
                <Box display="flex" justifyContent="space-around" width={1}>
                  <Box display="flex" flexDirection="column">
                    <Typography variant="subtitle1" noWrap>
                      {challengeInformation.name}
                    </Typography>
                    <Typography variant="body2">
                      {challengeInformation.address.city}, le {formatString(challengeInformation.startDate, "dd MMMM yyyy")}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link} to={ROUTES.RESULTS.LIST}
                    >
                      <KeyboardBackspaceIcon/>
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
            <Box className={classes.overflow} flexGrow={1}>
              <List>
                {
                  filtered(resultsInformation)
                    .map((resultInformation, index) =>
                      <ListItem
                        key={`${resultInformation.categoryId}.${resultInformation.disciplineId}`}
                        className={index % 2 === 0 ?  classes.alternateColor : ""}
                      >
                        <ListItemText
                          disableTypography
                          primary={`${resultInformation.categoryLabel} ${resultInformation.disciplineLabel}`}
                          secondary={
                            <Box display="flex">
                              <EmojiEventsIcon color="secondary" />
                              <Typography variant="body1" noWrap>
                                {resultInformation.results[0].firstname} {resultInformation.results[0].lastname}
                              </Typography>
                            </Box>
                          }
                        />
                        {
                          resultInformation.results.length > 3 ?
                            <>
                              {fullResultsDialog(resultInformation, true)}
                              <ListItemSecondaryAction>
                                <IconButton
                                  edge="end"
                                  onClick={() => handleResultsDialogOpen(getDialogIdForChallengeResultInformation(resultInformation))}
                                >
                                  <FormatListNumberedIcon fontSize="large"/>
                                </IconButton>
                              </ListItemSecondaryAction>
                            </>
                            : null
                        }
                      </ListItem>
                    )
                }
              </List>
            </Box>
            <Paper elevation={2}>
              <Box flexShrink={0}>
              <FormControl className={classes.alternateColor} variant="outlined" color="secondary" fullWidth>
                <OutlinedInput
                  labelWidth={0}
                  placeholder="RECHERCHE DE TIREUR"
                  onChange={handleSearchShooter}
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <BottomNavigation showLabels>
                <BottomNavigationAction
                  label="CATÉGORIES"
                  icon={<FilterListIcon />}
                  onClick={() => handleFilterDialogOpen(FilterType.CATEGORIES)}
                />
                <BottomNavigationAction
                  label="DISCIPLINES"
                  icon={<FilterListIcon />}
                  onClick={() => handleFilterDialogOpen(FilterType.DISCIPLINES)}
                />
              </BottomNavigation>
            </Box>
            </Paper>
          </Box>
          {filterDialog}
        </Mobile>
      </>
    );
  }
};

export default ResultsChallenge;
