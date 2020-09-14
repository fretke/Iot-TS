import * as actionTypes from "../Actions/actionTypes";
import { controlsActions } from "../Actions";

export interface servoData {
  name: string;
  pos: number;
  speed: number;
}

export interface controlsState {
  initialized: boolean;
  ledIsOn: boolean;
  servos: servoData[];
  loading: boolean;
  controllerBussy: boolean;
}

const initialState: controlsState = {
  initialized: false,
  ledIsOn: false,
  servos: [],
  loading: false,
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
        controllerBussy: true,
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
    case actionTypes.CONTROLLER_BUSY_START:
      return {
        ...state,
        controllerBussy: true,
      };
    case actionTypes.CONTROLLER_BUSY_END:
      return {
        ...state,
        controllerBussy: false,
      };

    default:
      return state;
  }
};
