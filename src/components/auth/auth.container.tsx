import React from 'react';
import { connect } from 'react-redux';
import { login } from 'redux/actions/auth.actions';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import Auth  from './auth';

class AuthContainer extends React.PureComponent<
  ReturnType<typeof mapDispatchToProps>,
  {}
  > {
  render() {
    return <Auth
      actions={this.props.actions}
    />;
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(
    {
      login
    },
    dispatch
  ),
});

export default connect(
  null,
  mapDispatchToProps
)(AuthContainer);
