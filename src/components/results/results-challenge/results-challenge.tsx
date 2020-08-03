import React, { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardActions, CardContent, CardHeader, Checkbox, Collapse, Divider,
  Grid, List, ListItem, ListItemText, ListSubheader,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@material-ui/core';
import { formatString } from '../../../utils/date.utils';
import { ROUTES } from '../../../configurations/server.configuration';
import TableContainer from '@material-ui/core/TableContainer';
import { paginationTheme } from '../../../configurations/theme.configuration';
import { makeStyles } from '@material-ui/core/styles';
import { EMPTY_PAGE, Page } from '../../../services/models/page.model';
import { GetChallengeListElementResponse, GetChallengeResponse } from '../../../services/models/challenge.model';
import ChallengeService from 'services/challenge.service';
import { Link } from 'react-router-dom';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

type ResultsChallengeProps = {
  challengeId: number,
  actions: {
    error: (message: string) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ResultsChallenge = (props: ResultsChallengeProps) => {

  const [challengeInformation, setChallengeInformation] = useState<GetChallengeResponse>();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [disciplinesOpen, setDisciplinesOpen] = useState(false);

  const handleCategoriesListFilterClick = () => {
    setCategoriesOpen(!categoriesOpen)
  }

  const handleDisciplinesListFilterClick = () => {
    setDisciplinesOpen(!disciplinesOpen)
  }

  useEffect(() => {
    let unmounted = false;
    ChallengeService.getChallenge(props.challengeId)
      .then(response => {
        if (!unmounted) {
          setChallengeInformation(response.data);
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
        <Box pt={2}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Box height="100%">
                <Paper elevation={1} style={{height: '100%'}}>
                  <List>
                    <ListItem button onClick={handleCategoriesListFilterClick}>
                      <ListItemText primary="CATEGORIES" />
                      {categoriesOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={categoriesOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem>
                          <Checkbox
                            checked={true}
                          />
                          <ListItemText primary="Minime G"/>
                        </ListItem>
                      </List>
                    </Collapse>
                    <ListItem button onClick={handleDisciplinesListFilterClick}>
                      <ListItemText primary="DISCIPLINES" />
                      {disciplinesOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={disciplinesOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem>
                          <Checkbox
                            checked={false}
                          />
                          <ListItemText primary="Pistolet"/>
                        </ListItem>
                      </List>
                    </Collapse>
                  </List>
                </Paper>
              </Box>
            </Grid>
            <Grid item container xs={9} spacing={2}>
              {/* for each card information from backend*/}
              <Grid item xs={4}>
                <Card>
                  <CardHeader title={
                    <Typography variant="h6">
                      Minime G Pistolet
                    </Typography>
                  }/>
                  <CardContent>
                    <Typography variant="body2">
                      1. Maurice Cuny
                    </Typography>
                    <Typography variant="body2">
                      2. Lisa Cuny
                    </Typography>
                    <Typography variant="body2">
                      3. Brian Dechoux
                    </Typography>
                    <Typography variant="body2">
                      ...
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">CLASSEMENT COMPLET</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card>
                  <CardHeader title={
                    <Typography variant="h6">
                      Minime G Pistolet
                    </Typography>
                  }/>
                  <CardContent>
                    <Typography variant="body2">
                      1. Maurice Cuny
                    </Typography>
                    <Typography variant="body2">
                      2. Lisa Cuny
                    </Typography>
                    <Typography variant="body2">
                      3. Brian Dechoux
                    </Typography>
                    <Typography variant="body2">
                      ...
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">CLASSEMENT COMPLET</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card>
                  <CardHeader title={
                    <Typography variant="h6">
                      Minime G Pistolet
                    </Typography>
                  }/>
                  <CardContent>
                    <Typography variant="body2">
                      1. Maurice Cuny
                    </Typography>
                    <Typography variant="body2">
                      2. Lisa Cuny
                    </Typography>
                    <Typography variant="body2">
                      3. Brian Dechoux
                    </Typography>
                    <Typography variant="body2">
                      ...
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">CLASSEMENT COMPLET</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card>
                  <CardHeader title={
                    <Typography variant="h6">
                      Minime G Pistolet
                    </Typography>
                  }/>
                  <CardContent>
                    <Typography variant="body2">
                      1. Maurice Cuny
                    </Typography>
                    <Typography variant="body2">
                      2. Lisa Cuny
                    </Typography>
                    <Typography variant="body2">
                      3. Brian Dechoux
                    </Typography>
                    <Typography variant="body2">
                      ...
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">CLASSEMENT COMPLET</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }
};

export default ResultsChallenge;
