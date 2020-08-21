import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import MyClubBillsShooters from './my-club-bills-shooters';
import { Actions } from 'store';
import { error } from 'redux/actions/error.actions';
import { openToast } from 'redux/actions/toast.actions';
import { push } from 'connected-react-router';

class MyClubBillsShootersContainer extends React.PureComponent<
  ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    return <MyClubBillsShooters {...this.props} />;
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

export default connect(null, mapDispatchToProps)(MyClubBillsShootersContainer);