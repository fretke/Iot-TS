import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./store/Reducers";
import { SocketContext } from "./Context/SocketContext";
import { SocketService } from "./Utils/SocketService";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
const socket = new SocketService();

ReactDOM.render(
  <Provider store={store}>
    <SocketContext.Provider value={socket}>
      <App color="red" />
    </SocketContext.Provider>
  </Provider>,
  document.getElementById("root")
);
