import * as actionTypes from "./actionTypes";
import { servoData } from "../Reducers/controlsReducer";
import { Dispatch } from "redux";
import axios from "axios";
import { SERVER } from "../../Settings/settings";
import { InitializeSequenceAction } from "./";

export interface AddNewSequenceToggleAction {
  type: typeof actionTypes.ADD_NEW_SEQUENCE_TOGGLE;
}

export interface AddNewSequenceElementAction {
  type: typeof actionTypes.ADD_NEW_SEQUENCE_ELEMENT;
  payload: servoData[];
}

export interface SaveNewSequenceAction {
  type: typeof actionTypes.SAVE_NEW_SEQUENCE;
  payload: {
    seqName: string;
    moves: servoData[];
  };
  //   title: string;
  //   payload: servoData[];
}

export interface DeleteSequenceAction {
  type: typeof actionTypes.DELETE_SEQUENCE;
  payload: string;
}

export type SeqActions =
  | AddNewSequenceToggleAction
  | AddNewSequenceElementAction
  | SaveNewSequenceAction
  | InitializeSequenceAction
  | DeleteSequenceAction;

export const addNewSequenceToggle = (): AddNewSequenceToggleAction => {
  return {
    type: actionTypes.ADD_NEW_SEQUENCE_TOGGLE,
  };
};

export const addNewSequenceElement = (
  data: servoData[]
): AddNewSequenceElementAction => {
  return {
    type: actionTypes.ADD_NEW_SEQUENCE_ELEMENT,
    payload: data,
  };
};

export const saveNewSequence = (
  seqTitle: string,
  moves: servoData[],
  userEmail: string
) => {
  return async (dispatch: Dispatch) => {
    const newEntry = { seqName: seqTitle, moves };
    try {
      const res = await axios.post(`${SERVER}/saveNewSequence`, {
        newEntry,
        userEmail,
      });
      if (res.data.success) {
        dispatch<SaveNewSequenceAction>({
          type: actionTypes.SAVE_NEW_SEQUENCE,
          payload: newEntry,
        });
      }
    } catch (err) {
      console.log(err, " error saving new Sequence to DB");
    }
  };
};

export const deleteSequence = (title: string, userEmail: string) => {
  return async (dispatch: Dispatch) => {
    try {
      console.log("before sending data to the server");
      const res = await axios.post(`${SERVER}/deleteSequence`, {
        title,
        userEmail,
      });
      if (res.data.success) {
        dispatch<DeleteSequenceAction>({
          type: actionTypes.DELETE_SEQUENCE,
          payload: title,
        });
      }
    } catch (err) {
      console.log(err, "error while deleting sequence");
    }
  };
};
