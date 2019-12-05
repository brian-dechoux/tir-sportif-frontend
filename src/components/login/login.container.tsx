import React from 'react';
import { connect } from 'react-redux';
import { login } from 'redux/actions/auth.actions';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import Login  from './login';
import { AppState } from '../../redux/reducers/combined.reducer';

class AuthContainer extends React.PureComponent<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  {}
  > {
  render() {
    const token = this.props.token;
    if (token !== null) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    return <Login
      actions={this.props.actions}
    />;
  }
}

const mapStateToProps = (state: AppState) => ({
  token: state.auth.token
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(
    {
      login
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer);
