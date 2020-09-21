import * as actionTypes from "./actionTypes";
import { SERVER } from "../../Settings/settings";
import { Dispatch } from "redux";
import axios from "axios";
import { initializeControlsAction } from "./userActions";
import { servoData } from "../Reducers/controlsReducer";

export interface UpdateBulbAction {
  type: typeof actionTypes.UPDATE_LED_STATE;
}
interface UpdateControlsStart {
  type: typeof actionTypes.UPDATE_CONTROLS_START;
}
interface UpdateControlsFinish {
  type: typeof actionTypes.UPDATE_CONTROLS_FINISH;
}
export interface ControllerBussyStart {
  type: typeof actionTypes.CONTROLLER_BUSY_START;
}

export interface ControllerBussyEnd {
  type: typeof actionTypes.CONTROLLER_BUSY_END;
}

export interface ControllerError {
  type: typeof actionTypes.CONTROLLER_ERROR;
  message: string;
}

export interface CloseControllerErrorModal {
  type: typeof actionTypes.CONTROLLER_ERROR_MODAL_CLOSE;
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

export interface UpdateServoAfterSeqAction {
  type: typeof actionTypes.UPDATE_SERVO_AFTER_SEQ;
  payload: servoData[];
}

export type controlsActions =
  | UpdateBulbAction
  | UpdateControlsStart
  | UpdateControlsFinish
  | initializeControlsAction
  | updateServoAction
  | ControllerBussyEnd
  | ControllerBussyStart
  | ControllerError
  | CloseControllerErrorModal
  | UpdateServoAfterSeqAction;

export const updateLED = (state: boolean, userEmail: string, id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch<UpdateControlsStart>({
        type: actionTypes.UPDATE_CONTROLS_START,
      });
      const res = await axios.post<responseFromUpdate>(`${SERVER}/updateBulb`, {
        user: userEmail,
        status: state,
        id,
      });
      if (res.data.updated) {
        dispatch<UpdateBulbAction>({
          type: actionTypes.UPDATE_LED_STATE,
        });
      }
      dispatch<UpdateControlsFinish>({
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
    dispatch<UpdateControlsStart>({
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
      dispatch<UpdateControlsFinish>({
        type: actionTypes.UPDATE_CONTROLS_FINISH,
      });
    } catch (err) {
      console.log(err, "error while updating servo");
    }
  };
};

export const toggleLED = (): UpdateBulbAction => {
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

export const updateServoAfterSeq = (
  data: servoData[]
): UpdateServoAfterSeqAction => {
  return {
    type: actionTypes.UPDATE_SERVO_AFTER_SEQ,
    payload: data,
  };
};

export const controllerStart = (): ControllerBussyStart => {
  return {
    type: actionTypes.CONTROLLER_BUSY_START,
  };
};

export const controllerFinish = (): ControllerBussyEnd => {
  return {
    type: actionTypes.CONTROLLER_BUSY_END,
  };
};

export const setControllerError = (message: string): ControllerError => {
  return {
    type: actionTypes.CONTROLLER_ERROR,
    message,
  };
};

export const closeControllerErrorModal = (): CloseControllerErrorModal => {
  return {
    type: actionTypes.CONTROLLER_ERROR_MODAL_CLOSE,
  };
};
