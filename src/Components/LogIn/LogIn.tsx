import React from "react";
import { connect } from "react-redux";

import { initializeUser } from "../../store/Actions";
import { StoreState } from "../../store/Reducers/index";
import { userReducerState } from "../../store/Reducers/userReducer";
import Modal from "../Modal/Modal";

export interface LogInState {
  email: string;
  pass: string;
}

interface LogInProps {
  initializeUser(data: LogInState): Promise<void>;
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
      <div>
        <h1>Log in Screen</h1>
        <input
          onChange={this.handleChange}
          type="text"
          name="email"
          value={this.state.email}
        />
        <input
          onChange={this.handleChange}
          type="password"
          name="pass"
          value={this.state.pass}
        />
        <button onClick={this.logInUser}>Log In</button>
        {this.props.user.errorMessage !== null && (
          <Modal title={this.props.user.errorMessage} />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: StoreState) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { initializeUser })(LogIn);
