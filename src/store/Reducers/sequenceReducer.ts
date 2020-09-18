import { servoData } from "./controlsReducer";
import * as actionTypes from "../Actions/actionTypes";
import { SeqActions } from "../Actions";

export interface seqState {
  seq: {
    seqName: string;
    moves: servoData[];
  }[];
  seqCreationModeOn: boolean;
  creationSeq: servoData[];
}

const seqReducerState: seqState = {
  seq: [
    {
      seqName: "test",
      moves: [
        {
          name: "firstServo",
          speed: 50,
          pos: 20,
        },
        {
          name: "firstServo",
          speed: 50,
          pos: 100,
        },
        {
          name: "secondServo",
          speed: 50,
          pos: 30,
        },
        {
          name: "secondServo",
          speed: 50,
          pos: 60,
        },
      ],
    },
  ],
  creationSeq: [],
  seqCreationModeOn: false,
};

export default (state = seqReducerState, action: SeqActions) => {
  switch (action.type) {
    case actionTypes.ADD_NEW_SEQUENCE_TOGGLE:
      return {
        ...state,
        seqCreationModeOn: !state.seqCreationModeOn,
      };
    case actionTypes.ADD_NEW_SEQUENCE_ELEMENT:
      console.log("<<<WHAT??>>>");
      const updated = [...state.creationSeq];
      updated.push(action.payload[0]);
      return {
        ...state,
        creationSeq: updated,
      };
    case actionTypes.SAVE_NEW_SEQUENCE:
      const newSeqArr = [...state.seq];
      newSeqArr.push(action.payload);

      return {
        ...state,
        seq: newSeqArr,
        creationSeq: [],
        seqCreationModeOn: false,
      };

    default:
      return state;
  }
};
