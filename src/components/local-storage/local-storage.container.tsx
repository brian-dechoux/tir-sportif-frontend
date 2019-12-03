import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers/combined.reducer';

/**
 * Empty rendering component, aiming only to store token into local storage observing state changes.
 */
interface LocalStorageProps {
  token: string | null
}

class LocalStorageContainer extends React.PureComponent<
  LocalStorageProps,
  {}
  > {
  render() {
    const token = this.props.token;
    if (token !== null) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    return null;
  }
}

const mapStateToProps = (state: AppState) => ({
  token: state.auth.token
});

export default connect(
  mapStateToProps
)(LocalStorageContainer);
