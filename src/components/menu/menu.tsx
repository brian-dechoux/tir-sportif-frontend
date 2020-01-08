import React from 'react';
import { Drawer, Icon, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../configurations/server.configuration';

// FIXME Correct the drawer shit, it's displayed on top of the appbar
//  Also, it doesn't care about grid layout
const Menu = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
    >
      <List>
        <ListItem
          button
          component={Link} to={ROUTES.FRONTEND.RESULTS}
        >
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
  );
};

export default Menu;
