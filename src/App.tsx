import React, { ReactNode } from "react";
import { connect } from "react-redux";

import { storeState } from "./store/Reducers";
import { userReducerState } from "./store/Reducers/userReducer";
import { controlsState } from "./store/Reducers/controlsReducer";

import LogIn from "./Components/LogIn/LogIn";
import ControlPanel from "./Containers/ControlPanel/ControlPanel";

interface AppProps {
  color: string;
  user: userReducerState;
  controls: controlsState;
}

class App extends React.Component<AppProps> {
  handleIncrement = (): void => {};

  render() {
    const { auth } = this.props.user;
    return auth && this.props.controls.initialized ? (
      <ControlPanel />
    ) : (
      <LogIn />
    );
  }
}

const mapStateToProps = (state: storeState) => {
  return {
    user: state.user,
    controls: state.controls,
  };
};

export default connect(mapStateToProps)(App);
