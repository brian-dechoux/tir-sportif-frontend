import React from 'react';
import { connect } from 'react-redux';
import { login, closeToast } from 'redux/actions/auth.actions';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { AppState } from '../../redux/reducers/combined.reducer';
import Main from './main';

class MainContainer extends React.PureComponent<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  {}
  > {
  render() {

    return <Main
    />;
  }
}

const mapStateToProps = (state: AppState) => ({
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainContainer);
