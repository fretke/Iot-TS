import React from "react";
import { connect } from "react-redux";

import {
  initializeUser,
  closeModal,
  closeModalAction,
} from "../../store/Actions";
import { StoreState } from "../../store/Reducers/index";
import { userReducerState } from "../../store/Reducers/userReducer";
import styles from "./LogIn.module.css";

export interface LogInState {
  email: string;
  pass: string;
}

interface LogInProps {
  initializeUser(data: LogInState): Promise<void>;
  closeModal(): closeModalAction;
  user: userReducerState;
}

class LogIn extends React.Component<LogInProps> {
  state: LogInState = {
    email: "",
    pass: "",
  };

  logInUser = (): void => {
    this.props.initializeUser(this.state);
    console.log("logging in");
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
    console.log(event.target.type);
  };

  render() {
    return (
      <div className={styles.Image}>
        <div className={styles.LogIn}>
          <h1>Log in Screen</h1>
          <p>Email</p>
          <input
            placeholder="enter e-mail"
            onChange={this.handleChange}
            type="text"
            name="email"
            value={this.state.email}
          />
          <p>Password</p>
          <input
            placeholder="enter password"
            onChange={this.handleChange}
            type="password"
            name="pass"
            value={this.state.pass}
          />
          <button onClick={this.logInUser}>Log In</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreState) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { initializeUser, closeModal })(LogIn);
