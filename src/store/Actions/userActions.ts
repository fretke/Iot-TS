import * as actionTypes from "./actionTypes";
import { SERVER } from "../../Settings/settings";
import axios from "axios";
import { Dispatch } from "redux";

import { LogInState } from "../../Components/LogIn/LogIn";
import { servoData } from "../Reducers/controlsReducer";

interface dataFromServer {
  auth?: boolean;
  userName: string;
  userEmail: string;
  IoT: controlData;
  id: string;
  message?: string;
}

// interface servoData {
//   name: string;
//   pos: number;
//   speed: number;
// }

interface controlData {
  ledIsOn: boolean;
  servos: servoData[];
}

interface initializeUserAction {
  type: typeof actionTypes.INITIALIZE_USER;
  payload: dataFromServer;
}

export interface initializeControlsAction {
  type: typeof actionTypes.INITIALIZE_CONTROLS;
  payload: controlData;
}

interface initializeUserErrorAction {
  type: typeof actionTypes.INITIALIZE_USER_FAIL;
  errorMessage: string;
}

export interface closeModalAction {
  type: typeof actionTypes.CLOSE_MODAL;
}

export type userActionTypes =
  | initializeUserAction
  | initializeUserErrorAction
  | closeModalAction;

export const initializeUser = (userData: LogInState) => {
  console.log(userData, "userdata");
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.post<dataFromServer>(`${SERVER}/logIn`, {
        userData,
      });
      if (res.data.auth) {
        dispatch<initializeUserAction>({
          type: actionTypes.INITIALIZE_USER,
          payload: {
            userName: res.data.userName,
            userEmail: res.data.userEmail,
            IoT: res.data.IoT,
            id: res.data.id,
          },
        });
        dispatch<initializeControlsAction>({
          type: actionTypes.INITIALIZE_CONTROLS,
          payload: res.data.IoT,
        });
      } else if (res.data.message) {
        dispatch<initializeUserErrorAction>({
          type: actionTypes.INITIALIZE_USER_FAIL,
          errorMessage: res.data.message,
        });
      }
    } catch (err) {
      console.log(err, "error initializing user");
    }
  };
};

export const closeModal = (): closeModalAction => {
  return {
    type: actionTypes.CLOSE_MODAL,
  };
};
