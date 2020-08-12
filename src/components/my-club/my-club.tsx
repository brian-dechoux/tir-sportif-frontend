import React, { PropsWithChildren } from 'react';
import { Box, Button, Divider, Grid, List, ListItem, Paper, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../configurations/server.configuration';
import InfoIcon from '@material-ui/icons/Info';
import GroupIcon from '@material-ui/icons/Group';
import ReceiptIcon from '@material-ui/icons/Receipt';

type MyClubProps = {
  menuSelectedPart: string;
}

// fixme specify types
const MyClub = (props: PropsWithChildren<MyClubProps>) => {
  const menuSelected = (selection: string) => props.menuSelectedPart === selection ? 'secondary' : 'primary';
  return (
    <Box pt={3}>
      <Box display="flex" justifyContent="center" pb={1}>
        <Box width={0.6}>
          <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h6">
                Gestion de mon club
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Divider/>
      <Box pt={3}>
        <Grid container spacing={3}>
          <Grid item xs={2}>
            <Box height="100%">
              <Paper elevation={1} style={{height: '100%'}}>
                <List>
                  <ListItem key='resume'>
                    <Button
                      component={Link} to={ROUTES.MYCLUB.RESUME}
                      startIcon={<InfoIcon color={menuSelected('resume')} />}
                    >
                      <Typography variant="button" color={menuSelected('resume')}>
                        Informations
                      </Typography>
                    </Button>
                  </ListItem>
                  <ListItem key='licensees'>
                    <Button
                      component={Link} to={ROUTES.MYCLUB.LICENSEES}
                      startIcon={<GroupIcon color={menuSelected('licensees')} />}
                    >
                      <Typography variant="button" color={menuSelected('licensees')}>
                        Licenciés
                      </Typography>
                    </Button>
                  </ListItem>
                  <ListItem key='bills'>
                    <Button
                      component={Link} to={ROUTES.MYCLUB.BILLS}
                      startIcon={<ReceiptIcon color={menuSelected('bills')} />}
                    >
                      <Typography variant="button" color={menuSelected('bills')}>
                        Factures
                      </Typography>
                    </Button>
                  </ListItem>
                </List>
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={10}>
            <Box height="100%">
              <Paper elevation={1} style={{height: '100%'}}>
                <Box pt={2} pb={2}>
                  <Box pl={2} pr={2}>
                    {props.children}
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default MyClub;
