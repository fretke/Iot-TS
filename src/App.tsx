import React, { ReactNode } from "react";

import LogIn from "./Components/LogIn/LogIn";

interface AppProps {
  color: string;
}

class App extends React.Component<AppProps> {
  state = { counter: 0 };

  handleIncrement = (): void => {};

  render() {
    return (
      <div>
        <LogIn />
      </div>
    );
  }
}

export default App;
