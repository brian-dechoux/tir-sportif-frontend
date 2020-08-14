import React from 'react';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import clsx from 'clsx';
import { history, store } from './store';
import 'typeface-roboto';
import ResultsContainer from './components/results/results-list/results-list.container';
import { ConnectedRouter } from 'connected-react-router';
import { ROUTES } from './configurations/server.configuration';
import HeaderContainer from './components/header/header.container';
import AuthenticatedRedirectContainer from './components/authenticated-route/authenticated.container';
import { Box, Container, MuiThemeProvider, Paper } from '@material-ui/core';
import ChallengeCreationContainer from './components/challenge/challenge-creation/challenge-creation.container';
import { makeStyles } from '@material-ui/core/styles';
import ToastContainer from './components/toast/toast.container';
import { customTheme } from './configurations/theme.configuration';
import ChallengeListContainer from './components/challenge/challenge-list/challenge-list.container';
import ChallengeDetailContainer from './components/challenge/challenge-detail/challenge-detail.container';
import ChallengeAddShooterContainer from './components/challenge/challenge-add-shooter/challenge-add-shooter.container';
import ChallengeShooterContainer from './components/challenge/challenge-shooter/challenge-shooter.container';
import ChallengeShotResultsContainer
  from './components/challenge/challenge-participation-shot-results/challenge-participation-shot-results.container';
import ResultsChallengeContainer from './components/results/results-challenge/results-challenge.container';
import Desktop from './components/media/desktop';
import Mobile from './components/media/mobile';
import { useMediaQuery } from 'react-responsive';
import MyClubContainer from './components/my-club/my-club.container';
import MyClubResumeContainer from './components/my-club/resume/my-club-resume.container';
import MyClubLicenseesContainer from './components/my-club/licensees/my-club-licensees.container';
import MyClubLicenseeDetailContainer from './components/my-club/licensee-detail/my-club-licensee-detail.container';
import MyClubLicenseeCreationContainer
  from './components/my-club/licensee-creation/my-club-licensee-creation.container';

// TODO https://react-redux.js.org/api/hooks ? to use react redux with functional component only and remove the container HOCs
const App = () => {
  const useStyles = makeStyles(() => ({
    main: {
      background: customTheme.mainBackground,
    },
    container: {
      background: customTheme.containerBackground,
      padding: 0
    },
    overflow: {
      "overflow": "auto"
    },
    flexGrow: {
      "flex-grow": 1
    }
  }));
  const classes = useStyles();

  const desktopContent = (
    <Box pl={2} pr={2} >
      <Box pt={2} pb={2} width={1}>
        <Switch>
          <Route exact path={ROUTES.RESULTS.LIST}>
            <ResultsContainer />
          </Route>

          <Route exact path={`${ROUTES.RESULTS.LIST}/:challengeId`}>
            <ResultsChallengeContainer />
          </Route>

          <Route exact path={ROUTES.CHALLENGE.LIST}>
            <AuthenticatedRedirectContainer>
              <ChallengeListContainer />
            </AuthenticatedRedirectContainer>
          </Route>

          <Route exact path={ROUTES.CHALLENGE.CREATION}>
            <ChallengeCreationContainer />
          </Route>

          <Route exact path={`${ROUTES.CHALLENGE.LIST}/:challengeId`}>
            <ChallengeDetailContainer />
          </Route>

          <Route exact path={`${ROUTES.CHALLENGE.LIST}/:challengeId${ROUTES.CHALLENGE.SHOOTER.CREATION}`}>
            <ChallengeAddShooterContainer />
          </Route>

          <Route exact path={`${ROUTES.CHALLENGE.LIST}/:challengeId${ROUTES.CHALLENGE.SHOOTER.LIST}/:shooterId`}>
            <ChallengeShooterContainer />
          </Route>

          <Route exact path={`${ROUTES.CHALLENGE.LIST}/:challengeId${ROUTES.CHALLENGE.SHOOTER.LIST}/:shooterId${ROUTES.CHALLENGE.SHOOTER.SHOT_RESULTS.LIST}/:disciplineId/:participationId`}>
            <ChallengeShotResultsContainer />
          </Route>

          <Route exact path={ROUTES.CLUBS}>
            <AuthenticatedRedirectContainer>clubs</AuthenticatedRedirectContainer>
          </Route>

          <Route exact path={ROUTES.MYCLUB.RESUME}>
            <AuthenticatedRedirectContainer>
              <MyClubContainer>
                <MyClubResumeContainer />
              </MyClubContainer>
            </AuthenticatedRedirectContainer>
          </Route>

          <Route exact path={ROUTES.MYCLUB.LICENSEES.LIST}>
            <AuthenticatedRedirectContainer>
              <MyClubContainer>
                <MyClubLicenseesContainer />
              </MyClubContainer>
            </AuthenticatedRedirectContainer>
          </Route>

          <Route exact path={`${ROUTES.MYCLUB.LICENSEES.LIST}/:licenseeId`}>
            <AuthenticatedRedirectContainer>
              <MyClubContainer>
                <MyClubLicenseeDetailContainer />
              </MyClubContainer>
            </AuthenticatedRedirectContainer>
          </Route>

          <Route exact path={ROUTES.MYCLUB.LICENSEES.CREATION}>
            <AuthenticatedRedirectContainer>
              <MyClubContainer>
                <MyClubLicenseeCreationContainer />
              </MyClubContainer>
            </AuthenticatedRedirectContainer>
          </Route>

          <Route exact path={ROUTES.MYCLUB.BILLS}>
            <AuthenticatedRedirectContainer>
              <MyClubContainer>

              </MyClubContainer>
            </AuthenticatedRedirectContainer>
          </Route>

          <Redirect to={ROUTES.RESULTS.LIST} />
        </Switch>
      </Box>
    </Box>
  );

  const mobileContent = (
    <Box width={1} height="100%">
      <Switch>
        <Route exact path={ROUTES.RESULTS.LIST}>
          <ResultsContainer />
        </Route>

        <Route exact path={`${ROUTES.RESULTS.LIST}/:challengeId`}>
          <ResultsChallengeContainer />
        </Route>

        <Redirect to={ROUTES.RESULTS.LIST} />
      </Switch>
    </Box>
  );

  const isMobile = useMediaQuery({maxWidth: customTheme.mediaBreakpoint - 1})

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Box height="100%" display="flex" flexDirection="column">
          <MuiThemeProvider theme={customTheme.mui}>
            <Box height="100%" display="flex" flexDirection="column">
              <Box>
                <Desktop>
                  <HeaderContainer />
                </Desktop>
                <ToastContainer />
              </Box>
              <Box pt={isMobile ? 0 : 2} pb={isMobile ? 0 : 2} height="100%" className={clsx(classes.main, classes.overflow)}>
                <Desktop>
                  <Container component={Paper} className={clsx(classes.container, classes.overflow)}>
                    {desktopContent}
                  </Container>
                </Desktop>
                <Mobile>
                  {mobileContent}
                </Mobile>
              </Box>
            </Box>
          </MuiThemeProvider>
        </Box>
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
