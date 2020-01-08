import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
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
        <ListItem button>
          <ListItemIcon><CloseIcon/></ListItemIcon>
        </ListItem>
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
          <ListItemText>Challenge</ListItemText>
        </ListItem>

        <ListItem
          button
          component={Link} to={ROUTES.FRONTEND.CLUBS}
        >
          <ListItemText>Clubs</ListItemText>
        </ListItem>

        <ListItem
          button
          component={Link} to={ROUTES.FRONTEND.MYCLUB}
        >
          <ListItemText>Mon club</ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Menu;
