import { combineReducers } from "redux";
import { userReducerState } from "./userReducer";
import seqReducer, { seqState } from "./sequenceReducer";

import userReducer from "../Reducers/userReducer";
import controlsReducer, { controlsState } from "../Reducers/controlsReducer";

export interface StoreState {
  user: userReducerState;
  controls: controlsState;
  allSeq: seqState;
}

export default combineReducers<StoreState>({
  user: userReducer,
  controls: controlsReducer,
  allSeq: seqReducer,
});
