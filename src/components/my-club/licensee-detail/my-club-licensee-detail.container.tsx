import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import MyClubLicenseeDetail from './my-club-licensee-detail';
import { Actions } from '../../../store';
import { error } from 'redux/actions/error.actions';
import { openToast } from 'redux/actions/toast.actions';
import { push } from 'connected-react-router';
import { RouteChildrenProps, withRouter } from 'react-router';
import { ROUTES } from 'configurations/server.configuration';

interface LicenseeDetailRouterProps {
  licenseeId: string;
}

class MyClubLicenseeDetailContainer extends React.PureComponent<
  RouteChildrenProps<LicenseeDetailRouterProps> & ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    if (this.props.match && this.props.match.params && this.props.match.params.licenseeId) {
      const paramLicenseeId = this.props.match.params.licenseeId;
      const parsedLicenseeId = parseInt(paramLicenseeId, 10);
      return <MyClubLicenseeDetail licenseeId={parsedLicenseeId} actions={this.props.actions} />;
    } else {
      return this.props.actions.push(ROUTES.MYCLUB.RESUME);
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

export default withRouter(connect(null, mapDispatchToProps)(MyClubLicenseeDetailContainer));
