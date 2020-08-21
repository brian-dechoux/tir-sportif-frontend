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
  Grid,
  IconButton,
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
import {
  ChallengeResultResponse,
  GetChallengeResponse,
  GetChallengeSeriesResultsResponse,
} from 'services/models/challenge.model';
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
import { customColors, customTheme, debounceDefaultValue } from '../../../configurations/theme.configuration';
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

type DetailedResultsDialogCompositeId = {
  categoryId: number;
  categoryLabel: string;
  disciplineId: number;
  disciplineLabel: string;
};

const detailedResultsDialogCompositeIdFromChallengeResults = (result: ChallengeResultResponse): DetailedResultsDialogCompositeId => { return {
  categoryId: result.categoryId,
  categoryLabel: result.categoryLabel,
  disciplineId: result.disciplineId,
  disciplineLabel: result.disciplineLabel,
}}

const ResultsChallenge = (props: ResultsChallengeProps) => {
  const useStyles = makeStyles(() => ({
    alternateColor: {
      "background": customColors.white
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
  const [resultsSeriesInformation, setResultsSeriesInformation] = useState<GetChallengeSeriesResultsResponse[]>([]);
  const [optionCategories, setOptionCategories] = useState<OptionsList>(OptionsList.fromLabels([], true));
  const [optionDisciplines, setOptionDisciplines] = useState<OptionsList>(OptionsList.fromLabels([], true));
  const [searchShooter, setSearchShooter] = useState<string>('');
  const [selectDeselectToggle, setSelectDeselectToggle] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [disciplinesOpen, setDisciplinesOpen] = useState(false);
  const [detailedResultsDialogOpen, setDetailedResultsDialogOpen] = useState<DetailedResultsDialogCompositeId>();
  const [filterDialogOpen, setFilterDialogOpen] = useState<FilterType>();

  const handleCategoriesListFilterClick = () => {
    setCategoriesOpen(!categoriesOpen)
  }

  const handleDisciplinesListFilterClick = () => {
    setDisciplinesOpen(!disciplinesOpen)
  }

  const handleResultsDialogOpen = (id: DetailedResultsDialogCompositeId) => {
    setDetailedResultsDialogOpen(id)
  }

  const handleResultsDialogClose = () => {
    setDetailedResultsDialogOpen(undefined)
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
        const sanitizedShooterNamePart = event.target.value?.trim() ?? '';
        setSearchShooter(sanitizedShooterNamePart);
      }, debounceDefaultValue);
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

  useEffect(() => {
    if (detailedResultsDialogOpen) {
      ChallengeService.getChallengeSeriesResults(props.challengeId, detailedResultsDialogOpen.categoryId, detailedResultsDialogOpen.disciplineId)
        .then(response => {
          setResultsSeriesInformation(response.data);
        })
        .catch(() => {
          props.actions.error('Impossible de récupérer le détail des résultats');
        });
    }
  }, [detailedResultsDialogOpen]);

  const detailedResultsDialog = (detailedDialogKey: DetailedResultsDialogCompositeId, mobileDisplay: boolean) => {
    if (detailedResultsDialogOpen?.categoryId === detailedDialogKey.categoryId && detailedResultsDialogOpen?.disciplineId === detailedDialogKey.disciplineId) {
      const dialogContent =
        <>
          <List component="div">
            {
              resultsSeriesInformation.map((singleResult, index) =>
                <ListItem key={`dialog.${singleResult.firstname}.${singleResult.lastname}`}>
                  <ListItemText disableTypography
                    primary={
                      <Typography variant="body1" noWrap>
                        {index + 1}. {singleResult.firstname} {singleResult.lastname}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" noWrap>
                        {singleResult.participationSeriesPoints.join(' - ')}
                      </Typography>
                    }
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
      return (
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
                    {detailedDialogKey.categoryLabel} {detailedDialogKey.disciplineLabel}
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
      );
    }
    return null;
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
          resultInformation.results.some(result =>
            [`${result.lastname} ${result.firstname}`, `${result.firstname} ${result.lastname}`].some(fullName => fullName.toLowerCase().includes(searchShooter.toLowerCase()))
          ) : true
      ).filter(resultInformation => {
        return optionCategories.active(resultInformation.categoryLabel) &&
          optionDisciplines.active(resultInformation.disciplineLabel)
      })
  }

  const filterDialog = filterDialogOpen ?
      <Dialog
        fullScreen
        scroll="paper"
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
            <Grid container spacing={2}>
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
                          <CardActions>
                            <Button
                              size="small"
                              startIcon={<FormatListNumberedIcon/>}
                              onClick={() => handleResultsDialogOpen(detailedResultsDialogCompositeIdFromChallengeResults(resultInformation))}
                            >
                              DÉTAIL
                            </Button>
                          </CardActions>
                          {detailedResultsDialog(detailedResultsDialogCompositeIdFromChallengeResults(resultInformation), false)}
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
                        {detailedResultsDialog( detailedResultsDialogCompositeIdFromChallengeResults(resultInformation), true)}
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleResultsDialogOpen(detailedResultsDialogCompositeIdFromChallengeResults(resultInformation))}
                          >
                            <FormatListNumberedIcon fontSize="large"/>
                          </IconButton>
                        </ListItemSecondaryAction>
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
