import * as actionTypes from "../Actions/actionTypes";
import { controlsActions } from "../Actions";

export interface servoData {
  name: string;
  pos: number;
  speed: number;
}

export interface ControllerData {
  error: boolean;
  busy: boolean;
  message: string;
}

export interface controlsState {
  initialized: boolean;
  ledIsOn: boolean;
  servos: servoData[];
  loading: boolean;
  controller: ControllerData;
  controllerBussy: boolean;
  // controllerError: boolean;
}

const initialState: controlsState = {
  initialized: false,
  ledIsOn: false,
  servos: [],
  loading: false,
  controller: {
    error: false,
    busy: false,
    message: "",
  },
  controllerBussy: false,
};

export default (state = initialState, action: controlsActions) => {
  switch (action.type) {
    case actionTypes.INITIALIZE_CONTROLS:
      return {
        ...state,
        initialized: true,
        ...action.payload,
      };
    case actionTypes.UPDATE_CONTROLS_START:
      return {
        ...state,
        loading: true,

        controller: {
          ...state.controller,
          busy: true,
        },
      };
    case actionTypes.UPDATE_CONTROLS_FINISH:
      return {
        ...state,
        loading: false,
      };
    case actionTypes.UPDATE_LED_STATE: {
      return {
        ...state,
        ledIsOn: !state.ledIsOn,
      };
    }
    case actionTypes.UPDATE_SERVO: {
      const updatedServos = state.servos.map((servo) => {
        if (servo.name === action.servoName) {
          servo[action.property] = action.value;
          return servo;
        }
        return servo;
      });
      return {
        ...state,
        servos: updatedServos,
      };
    }
    case actionTypes.UPDATE_SERVO_AFTER_SEQ:
      const updatedArr = [...state.servos];
      action.payload.forEach((servo) => {
        for (let i = 0; i < updatedArr.length; i++) {
          if (servo.name === updatedArr[i].name) {
            updatedArr[i].speed = servo.speed;
            updatedArr[i].pos = servo.pos;
            break;
          }
        }
      });
      return {
        ...state,
        servos: updatedArr,
      };
    case actionTypes.CONTROLLER_BUSY_START:
      return {
        ...state,
        controller: {
          ...state.controller,
          busy: true,
        },
      };
    case actionTypes.CONTROLLER_BUSY_END:
      return {
        ...state,
        controller: {
          ...state.controller,
          busy: false,
        },
      };
    case actionTypes.CONTROLLER_ERROR:
      return {
        ...state,
        controller: {
          busy: false,
          error: true,
          message: action.message,
        },
      };
    case actionTypes.CONTROLLER_ERROR_MODAL_CLOSE:
      return {
        ...state,
        controller: {
          ...state.controller,
          error: false,
          message: "",
        },
      };

    default:
      return state;
  }
};
