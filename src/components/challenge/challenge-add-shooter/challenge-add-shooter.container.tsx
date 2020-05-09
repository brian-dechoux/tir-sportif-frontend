import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import ChallengeAddShooter from './challenge-add-shooter';
import { error } from 'redux/actions/error.actions';
import { push } from 'connected-react-router';
import { openToast } from 'redux/actions/toast.actions';
import { Actions } from '../../../store';
import AppState from 'redux/states/app.state.type';
import { getCountries } from 'redux/actions/general.actions';

class ChallengeAddShooterContainer extends React.PureComponent<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    if (this.props.countries.length === 0) {
      // TODO BDX put it in local storage
      this.props.actions.getCountries();
    }
    return <ChallengeAddShooter {...this.props} />;
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    countries: state.general.countries,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  actions: bindActionCreators(
    {
      error: error,
      openToast: openToast,
      push: push,
      getCountries: getCountries,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeAddShooterContainer);
