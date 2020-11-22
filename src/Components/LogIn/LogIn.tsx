import React from "react";
import styles from "./LogIn.module.css";
import {UserService} from "../../services/UserService";


interface Props {
  client: UserService;
}

export interface LogInState {
  email: string;
  pass: string;
}

class LogIn extends React.Component<Props, LogInState> {

  constructor(props: Props) {
    super(props);
    this.state = {
      email: "",
      pass: "",
    }
  }

  private onLogIn (): void {
    const {email, pass} = this.state;
    this.props.client.initialize({email, pass})

    console.log("logging in");
  };

  private onInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    if (name === "email") {
      this.setState({email: value})
    } else {
      this.setState({pass: value})
    }
  }

  render() {
    return (
      <div className={styles.Image}>
        <div className={styles.LogIn}>
          <h1>Log in Screen</h1>
          <p>Email</p>
          <input
            placeholder="enter e-mail"
            onChange={(e) => this.onInputChange(e)}
            type="text"
            name="email"
            value={this.state.email}
          />
          <p>Password</p>
          <input
            placeholder="enter password"
            onChange={(e) => this.onInputChange(e)}
            type="password"
            name="pass"
            value={this.state.pass}
          />
          <button onClick={() => this.onLogIn()}>Log In</button>
        </div>
      </div>
    );
  }
}

export default LogIn;
