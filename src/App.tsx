import React from "react";
import { connect } from "react-redux";

import { StoreState } from "./store/Reducers";
import { userReducerState } from "./store/Reducers/userReducer";
import { controlsState } from "./store/Reducers/controlsReducer";
import LogIn from "./Components/LogIn/LogIn";
import ControlPanel from "./Containers/ControlPanel/ControlPanel";
import Modal from "./Components/Modal/Modal";
import { closeModal, closeModalAction } from "./store/Actions";

interface AppProps {
  user: userReducerState;
  controls: controlsState;
  closeModal(): closeModalAction;
}

class App extends React.Component<AppProps> {
  render() {
    const { auth } = this.props.user;
    return auth && this.props.controls.initialized ? (
      <ControlPanel />
    ) : (
      <React.Fragment>
        <LogIn />
        {this.props.user.errorMessage !== null && (
          <Modal
            click={this.props.closeModal}
            title={this.props.user.errorMessage}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: StoreState) => {
  return {
    user: state.user,
    controls: state.controls,
  };
};

export default connect(mapStateToProps, { closeModal })(App);
