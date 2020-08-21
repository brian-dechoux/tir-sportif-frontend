import React from 'react';
import { RouteChildrenProps, RouteComponentProps, withRouter } from 'react-router';
import MyClub from './my-club';

class MyClubContainer extends React.PureComponent<
  RouteChildrenProps<any> & RouteComponentProps<any>,
  {}
> {
  render() {
    const myclubMenuSelectedPart = this.props.history.location.pathname.toLowerCase().split("/")[2]
    return (
      <MyClub menuSelectedPart={myclubMenuSelectedPart}>
        {this.props.children}
      </MyClub>
    );
  }
}

export default withRouter(MyClubContainer);
