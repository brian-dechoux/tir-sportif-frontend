import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers/combined.reducer';
import Layout from './layout';

class LayoutContainer extends React.PureComponent<
  ReturnType<typeof mapStateToProps>,
  {}
  > {
  render() {
    return <Layout
      connected={this.props.token != null}
      elements={this.props.children}
    />;
  }
}

const mapStateToProps = (state: AppState) => ({
  token: state.auth.token
});

export default connect(
  mapStateToProps
)(LayoutContainer);
