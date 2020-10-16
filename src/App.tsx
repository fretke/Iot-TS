import React from "react";
import { connect } from "react-redux";

import { StoreState } from "./store/Reducers";
import { userReducerState } from "./store/Reducers/userReducer";
import { controlsState } from "./store/Reducers/controlsReducer";
import LogIn from "./Components/LogIn/LogIn";
import ControlPanel from "./Containers/ControlPanel/ControlPanel";
import Modal from "./Components/Modal/Modal";
import Spinner from "./Components/Spinner/Spinner";
import { closeModal, closeModalAction, logInUser } from "./store/Actions";
import Cookies from "universal-cookie";

interface AppProps {
  user: userReducerState;
  controls: controlsState;
  closeModal(): closeModalAction;
  logInUser(id: string): Promise<void>;
}

const cookie = new Cookies();

class App extends React.Component<AppProps> {

  componentDidMount() {
    console.log(cookie.get("user"), "<= kukis");
    if (cookie.get("user")) {
      this.props.logInUser(cookie.get("user"));
    }
    console.log("before render");
  }

  render() {
    const { auth } = this.props.user;
    if (cookie.get("user") && !auth) return <Spinner />;
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

export default connect(mapStateToProps, { closeModal, logInUser })(App);
