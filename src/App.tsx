import React from "react";
import { connect } from "react-redux";

import { StoreState } from "./store/Reducers";
import { userReducerState } from "./store/Reducers/userReducer";
import { controlsState } from "./store/Reducers/controlsReducer";
import LogIn from "./Components/LogIn/LogIn";
import ControlPanel from "./Containers/ControlPanel/ControlPanel";

interface AppProps {
  user: userReducerState;
  controls: controlsState;
}

class App extends React.Component<AppProps> {
  render() {
    const { auth } = this.props.user;
    return auth && this.props.controls.initialized ? (
      <ControlPanel />
    ) : (
      <LogIn />
    );
  }
}

const mapStateToProps = (state: StoreState) => {
  return {
    user: state.user,
    controls: state.controls,
  };
};

export default connect(mapStateToProps)(App);
