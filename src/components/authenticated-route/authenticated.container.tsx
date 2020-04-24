import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'redux/reducers/combined.reducer';
import { Redirect } from 'react-router';
import { ROUTES } from 'configurations/server.configuration';

type AuthenticatedRedirectContainerProps = {
  children: React.ReactNode;
};

class AuthenticatedRedirectContainer extends React.Component<ReturnType<typeof mapStateToProps>> {
  render() {
    const { isAuthenticated, children } = this.props;
    return isAuthenticated ? children : <Redirect to={ROUTES.RESULTS} />;
  }
}

const mapStateToProps = (state: AppState, ownProps: AuthenticatedRedirectContainerProps) => ({
  isAuthenticated: state.auth.token != null,
  children: ownProps.children,
});

export default connect(mapStateToProps)(AuthenticatedRedirectContainer);
