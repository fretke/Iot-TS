import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

ReactDOM.render(
  <React.StrictMode>
    <App color="red" />
  </React.StrictMode>,
  document.getElementById("root")
);
