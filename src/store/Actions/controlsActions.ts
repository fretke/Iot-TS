import * as actionTypes from "./actionTypes";
import { SERVER } from "../../Settings/settings";
import { Dispatch } from "redux";
import axios from "axios";
import { initializeControlsAction } from "./userActions";

export interface updateBulbAction {
  type: typeof actionTypes.UPDATE_LED_STATE;
}
interface updateControlsStart {
  type: typeof actionTypes.UPDATE_CONTROLS_START;
}
interface updateControlsFinish {
  type: typeof actionTypes.UPDATE_CONTROLS_FINISH;
}

interface responseFromUpdate {
  updated: boolean;
}

export enum Property {
  pos = "pos",
  speed = "speed",
}

export interface updateServoAction {
  type: typeof actionTypes.UPDATE_SERVO;
  servoName: string;
  property: Property;
  value: number;
}

export type controlsActions =
  | updateBulbAction
  | updateControlsStart
  | updateControlsFinish
  | initializeControlsAction
  | updateServoAction;

export const updateLED = (state: boolean, userEmail: string, id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch<updateControlsStart>({
        type: actionTypes.UPDATE_CONTROLS_START,
      });
      const res = await axios.post<responseFromUpdate>(`${SERVER}/updateBulb`, {
        user: userEmail,
        status: state,
        id,
      });
      if (res.data.updated) {
        dispatch<updateBulbAction>({
          type: actionTypes.UPDATE_LED_STATE,
        });
      }
      dispatch<updateControlsFinish>({
        type: actionTypes.UPDATE_CONTROLS_FINISH,
      });
    } catch (err) {
      console.log(err, "error in updating LED");
    }
  };
};

export const updateServo = (
  servoName: string,
  property: Property,
  value: number,
  userEmail: string,
  id: string
) => {
  return async (dispatch: Dispatch) => {
    dispatch<updateControlsStart>({
      type: actionTypes.UPDATE_CONTROLS_START,
    });
    try {
      const res = await axios.post<responseFromUpdate>(
        `${SERVER}/updateServo`,
        {
          servoName,
          property,
          value,
          userEmail,
          id,
        }
      );
      if (res.data.updated) {
        dispatch<updateServoAction>({
          type: actionTypes.UPDATE_SERVO,
          servoName,
          property,
          value,
        });
      }
      dispatch<updateControlsFinish>({
        type: actionTypes.UPDATE_CONTROLS_FINISH,
      });
    } catch (err) {
      console.log(err, "error while updating servo");
    }
  };
};

export const toggleLED = (): updateBulbAction => {
  return {
    type: actionTypes.UPDATE_LED_STATE,
  };
};

export const updateServoWS = (
  servoName: string,
  property: Property,
  value: number
): updateServoAction => {
  return {
    type: actionTypes.UPDATE_SERVO,
    servoName,
    property,
    value,
  };
};
