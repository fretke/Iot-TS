import * as actionTypes from "./actionTypes";
import { servoData } from "../Reducers/controlsReducer";
import { Dispatch } from "redux";

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

export type SeqActions =
  | AddNewSequenceToggleAction
  | AddNewSequenceElementAction
  | SaveNewSequenceAction;

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

export const saveNewSequence = (seqTitle: string, moves: servoData[]) => {
  return async (dispatch: Dispatch) => {
    const newEntry = { seqName: seqTitle, moves };
    dispatch<SaveNewSequenceAction>({
      type: actionTypes.SAVE_NEW_SEQUENCE,
      payload: newEntry,
    });
  };
};
