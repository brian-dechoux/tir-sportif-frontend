import React, { useEffect, useState } from 'react';
import {
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
  List,
  ListItem,
  ListItemAvatar, ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
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
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { Option, OptionsList } from 'models/options-list.model';

type ResultsChallengeProps = {
  challengeId: number,
  actions: {
    error: (message: string) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const getDialogIdForChallengeResultInformation = (resultInformation: ChallengeResultResponse) => `${resultInformation.categoryId}.${resultInformation.disciplineId}`;

const ResultsChallenge = (props: ResultsChallengeProps) => {

  const [challengeInformation, setChallengeInformation] = useState<GetChallengeResponse>();
  const [resultsInformation, setResultsInformation] = useState<ChallengeResultResponse[]>([]);
  const [optionCategories, setOptionCategories] = useState<OptionsList>(OptionsList.fromLabels([], true));
  const [optionDisciplines, setOptionDisciplines] = useState<OptionsList>(OptionsList.fromLabels([], true));
  const [selectDeselectToggle, setSelectDeselectToggle] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [disciplinesOpen, setDisciplinesOpen] = useState(false);
  const [fullResultsDialogOpen, setFullResultsDialogOpen] = useState<string>();

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

  const handleCategoryChecked = (category: Option) => {
    const updatedCategories = optionCategories.toggleOptionWithLabel(category.optionLabel);
    setOptionCategories(updatedCategories);
  }

  const handleDisciplineChecked = (discipline: Option) => {
    const updatedDisciplines = optionDisciplines.toggleOptionWithLabel(discipline.optionLabel);
    setOptionDisciplines(updatedDisciplines);
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

  if (!challengeInformation) {
    // TODO spinner (with message?)
    return null;
  } else {
    return (
      <>
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
                  {challengeInformation.name}, à {challengeInformation.address.city}, le{' '}
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
                    <ListItem button key='categories' onClick={handleCategoriesListFilterClick}>
                      <ListItemText primary="CATEGORIES" />
                      {categoriesOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={categoriesOpen} timeout="auto">
                      <List component="div" dense>
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
                      </List>
                    </Collapse>
                    <ListItem button key='disciplines' onClick={handleDisciplinesListFilterClick}>
                      <ListItemText primary="DISCIPLINES" />
                      {disciplinesOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={disciplinesOpen} timeout="auto">
                      <List component="div" dense>
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
                      </List>
                    </Collapse>
                  </List>
                </Paper>
              </Box>
            </Grid>
            <Grid item container xs={9} spacing={2}>
              {
                resultsInformation
                  .filter(resultInformation => {
                    return optionCategories.active(resultInformation.categoryLabel) &&
                      optionDisciplines.active(resultInformation.disciplineLabel)
                  }).map(resultInformation =>
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
                        {
                          fullResultsDialogOpen === getDialogIdForChallengeResultInformation(resultInformation) ?
                            <Dialog
                            maxWidth='sm'
                            fullWidth
                            open={true}
                            onClose={handleResultsDialogClose}
                            >
                              <DialogTitle>Classement complet</DialogTitle>
                              <DialogContent>
                              <List component="div" dense>
                              {
                                resultInformation.results.map((singleResult, index) =>
                                  <ListItem key={`dialog.${singleResult.firstname}.${singleResult.lastname}`}>
                                    <ListItemAvatar>{index + 1}.</ListItemAvatar>
                                    <ListItemText primary={`${singleResult.firstname} ${singleResult.lastname}`}/>
                                    <ListItemSecondaryAction>{singleResult.participationTotalPoints}</ListItemSecondaryAction>
                                  </ListItem>
                                )
                              }
                              </List>
                              </DialogContent>
                              <DialogActions>
                              <Button onClick={handleResultsDialogClose} color="primary">
                              FERMER
                              </Button>
                              </DialogActions>
                            </Dialog>
                            : null
                        }
                      </Card>
                    </Grid>
                  )
              }
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }
};

export default ResultsChallenge;
