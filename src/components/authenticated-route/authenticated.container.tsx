import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers/combined.reducer';
import { Redirect } from 'react-router';

type AuthenticatedContainerProps = {
  mustRedirect: boolean,
  children: React.ReactNode
};

class AuthenticatedContainer extends React.Component<ReturnType<typeof mapStateToProps>> {

  render() {
    const { isAuthenticated, mustRedirect, children } = this.props;

    return (
      isAuthenticated ?
        children
        : (
          mustRedirect ? <Redirect to={"/login"}/> : null
        )
    );
  }

}

const mapStateToProps = (state: AppState, ownProps: AuthenticatedContainerProps) => ({
  isAuthenticated: state.auth.token != null,
  mustRedirect: ownProps.mustRedirect,
  children: ownProps.children
});

export default connect(
  mapStateToProps
)(AuthenticatedContainer);
