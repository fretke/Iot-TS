import * as actionTypes from "../Actions/actionTypes";

import { userActionTypes } from "../Actions/userActions";

export interface userReducerState {
  id: string;
  userName: string | null;
  userEmail: string;
  auth: boolean;
  errorMessage: string | null;
}

const initialState = {
  id: "",
  userName: null,
  userEmail: "",
  auth: false,
  errorMessage: null,
};

export default (
  state: userReducerState = initialState,
  action: userActionTypes
) => {
  switch (action.type) {
    case actionTypes.INITIALIZE_USER:
      return {
        ...state,
        userName: action.payload.userName,
        userEmail: action.payload.userEmail,
        id: action.payload.id,
        // IoT: action.payload.IoT,
        auth: true,
      };
    case actionTypes.INITIALIZE_USER_FAIL:
      return {
        ...state,
        errorMessage: action.errorMessage,
      };
    case actionTypes.CLOSE_MODAL:
      return {
        ...state,
        errorMessage: null,
      };
    default:
      return state;
  }
};
