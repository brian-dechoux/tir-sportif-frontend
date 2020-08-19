import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import AddShooter from './add-shooter';
import { error } from 'redux/actions/error.actions';
import { push } from 'connected-react-router';
import { openToast } from 'redux/actions/toast.actions';
import { Actions } from 'store';
import AppState from 'redux/states/app.state.type';
import { getCountries } from 'redux/actions/general.actions';
import { addShooter } from 'redux/actions/add-shooter.actions';
import { GetClubResponse } from 'services/models/club.model';
import { GetCategoryResponse } from 'services/models/category.model';

type AddShooterContainerProps = {
  clubs: GetClubResponse[];
  searchFilterFreeClubOnly: boolean;
  filteredCategories?: GetCategoryResponse[];
  backRoute: string;
  validateButtonLabel: string;
}

class AddShooterContainer extends React.PureComponent<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & AddShooterContainerProps,
  {}
> {
  render() {
    if (this.props.countries.length === 0) {
      this.props.actions.getCountries();
    }
    return <AddShooter {...this.props} />;
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    countries: state.general.countries,
    categories: state.general.categories,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  actions: bindActionCreators(
    {
      error: error,
      openToast: openToast,
      push: push,
      getCountries: getCountries,
      addShooter: addShooter
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddShooterContainer);
