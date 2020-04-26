import React from 'react';
import { connect } from 'react-redux';
import { closeToast } from 'redux/actions/toast.actions';
import { bindActionCreators, Dispatch } from 'redux';
import { AppState } from 'redux/states/app.state.type';
import Toast from './toast';
import { Actions } from '../../store';

class ToastContainer extends React.PureComponent<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  {}
> {
  render() {
    return (
      <Toast
        isShown={this.props.isShown}
        message={this.props.message}
        variant={this.props.variant}
        onCloseCallback={() => this.props.actions.closeToast()}
      />
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  isShown: state.toast.isShown,
  message: state.toast.message,
  variant: state.toast.variant,
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  actions: bindActionCreators(
    {
      closeToast,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToastContainer);
