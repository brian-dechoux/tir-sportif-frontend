import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import ClubDetail from './club-detail';
import { Actions } from '../../../store';
import { error } from 'redux/actions/error.actions';
import { openToast } from 'redux/actions/toast.actions';
import { push } from 'connected-react-router';
import { RouteChildrenProps, withRouter } from 'react-router';
import { ROUTES } from 'configurations/server.configuration';

interface LicenseeDetailRouterProps {
  clubId: string;
}

class ClubDetailContainer extends React.PureComponent<
  RouteChildrenProps<LicenseeDetailRouterProps> & ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    if (this.props.match && this.props.match.params && this.props.match.params.clubId) {
      const paramClubId = this.props.match.params.clubId;
      const parsedClubId = parseInt(paramClubId, 10);
      return <ClubDetail clubId={parsedClubId} actions={this.props.actions} />;
    } else {
      return this.props.actions.push(ROUTES.CLUBS.LIST);
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  actions: bindActionCreators(
    {
      error: error,
      openToast: openToast,
      push: push,
    },
    dispatch
  ),
});

export default withRouter(connect(null, mapDispatchToProps)(ClubDetailContainer));
