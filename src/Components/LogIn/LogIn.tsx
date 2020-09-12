import React from "react";

interface LogInState {
  email: string;
  pass: string;
}

class LogIn extends React.Component {
  state: LogInState = {
    email: "",
    pass: "",
  };

  logInUser = (): void => {
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
        {/* {props.user.errorMessage !== null && (
        <Modal title={props.user.errorMessage} />
      )} */}
      </div>
    );
  }
}

export default LogIn;
