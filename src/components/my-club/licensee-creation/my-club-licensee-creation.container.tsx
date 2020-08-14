import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import MyClubLicenseeCreation from './my-club-licensee-creation';
import { Actions } from 'store';
import { error } from 'redux/actions/error.actions';
import { openToast } from 'redux/actions/toast.actions';
import { push } from 'connected-react-router';
import { resetShooter } from 'redux/actions/add-shooter.actions';
import AppState from 'redux/states/app.state.type';

class MyClubLicenseeCreationContainer extends React.PureComponent<
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    return <MyClubLicenseeCreation {...this.props} />;
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    countries: state.general.countries,
    categories: state.general.categories,
    callbackShooterFn: state.addShooter.callback,
    shooterFirstname: state.addShooter.firstname,
    shooterLastname: state.addShooter.lastname,
    shooterResolved: state.addShooter.resolved,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  actions: bindActionCreators(
    {
      error: error,
      openToast: openToast,
      push: push,
      resetShooter: resetShooter
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyClubLicenseeCreationContainer);
