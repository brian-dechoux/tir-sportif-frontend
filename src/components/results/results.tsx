import React from 'react';
import AuthenticatedContainer from '../authenticated-route/authenticated.container';
import { Typography } from '@material-ui/core';
import Menu from '../menu/menu';
import HeaderContainer from '../header/header.container';

const Results = () =>  {
  return (
    /*<AuthenticatedContainer mustRedirect={false}>
      <Menu>
        <Typography>Results</Typography>
      </Menu>
    </AuthenticatedContainer>*/
    <>
      <Typography>Results</Typography>
    </>
  );
};

export default Results;
