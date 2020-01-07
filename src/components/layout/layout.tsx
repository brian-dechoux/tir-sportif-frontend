import React from 'react';
import HeaderContainer from '../header/header.container';
import { Box, Drawer, Grid, Icon, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../configurations/server.configuration';

type LayoutProps = {
  connected: boolean,
  children: React.ReactNode
};

// FIXME Correct the drawer shit, it's displayed on top of the appbar
//  Also, it doesn't care about grid layout
class Layout extends React.Component<LayoutProps> {

    render() {
      let content;
      if (this.props.connected) {
        content = (
          <Grid container item md={12}>
            <Grid item md={2}>
              <Drawer

                variant="permanent"
                anchor="left"
              >
                <List>
                  <ListItem
                    button
                    component={Link} to={ROUTES.FRONTEND.RESULTS}
                  >
                    <ListItemIcon><Icon className="fa fa-plus-circle" /></ListItemIcon>
                    <ListItemText>Résultats</ListItemText>
                  </ListItem>
                  <ListItem
                    button
                    component={Link} to={ROUTES.FRONTEND.CHALLENGE}
                  >
                    <ListItemIcon><Icon className="fa fa-plus-circle" /></ListItemIcon>
                    <ListItemText>Challenge</ListItemText>
                  </ListItem>
                  <ListItem
                    button
                    component={Link} to={ROUTES.FRONTEND.CLUBS}
                  >
                    <ListItemIcon><Icon className="fa fa-plus-circle" color="primary" /></ListItemIcon>
                    <ListItemText>Clubs</ListItemText>
                  </ListItem>
                  <ListItem
                    button
                    component={Link} to={ROUTES.FRONTEND.MYCLUB}
                  >
                    <ListItemIcon><Icon className="fa fa-plus-circle" color="secondary" /></ListItemIcon>
                    <ListItemText>Mon club</ListItemText>
                  </ListItem>
                </List>
              </Drawer>
            </Grid>
            <Grid item md={10}>
              { this.props.children }
            </Grid>
          </Grid>
        );
      } else {
        content = (
          <Grid item md={12}>
            { this.props.children }
          </Grid>
        )
      }

      return (
        <>
          <Box>
            <Grid container direction='column'>
              <Grid item md={12}>
                <HeaderContainer />
              </Grid>
              {content}
            </Grid>
          </Box>
        </>
      );
    }

}

export default Layout;
