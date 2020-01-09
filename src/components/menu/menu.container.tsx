import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers/combined.reducer';
import Menu from './menu';

class MenuContainer extends React.PureComponent<
  ReturnType<typeof mapStateToProps>,
  {}
  > {
  render() {
    return (
      this.props.isAuthenticated ?
        <Menu/>
        : null
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  isAuthenticated: state.auth.token != null
});

export default connect(
  mapStateToProps
)(MenuContainer);
