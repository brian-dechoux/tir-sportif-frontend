import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import MyClubBillsShooterDetail from './my-club-bills-shooter-detail';
import { Actions } from 'store';
import { error } from 'redux/actions/error.actions';
import { openToast } from 'redux/actions/toast.actions';
import { push } from 'connected-react-router';
import { RouteChildrenProps, withRouter } from 'react-router';
import { ROUTES } from 'configurations/server.configuration';

interface BillsShooterDetailRouterProps {
  shooterId: string;
}

class MyClubBillsShooterDetailContainer extends React.PureComponent<
  RouteChildrenProps<BillsShooterDetailRouterProps> & ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    if (this.props.match && this.props.match.params && this.props.match.params.shooterId) {
      const paramLicenseeId = this.props.match.params.shooterId;
      const parsedShooterId = parseInt(paramLicenseeId, 10);
      return <MyClubBillsShooterDetail shooterId={parsedShooterId} actions={this.props.actions} />;
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

export default withRouter(connect(null, mapDispatchToProps)(MyClubBillsShooterDetailContainer));
