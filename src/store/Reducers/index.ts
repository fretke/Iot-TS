import { combineReducers } from "redux";
import { userReducerState } from "../Reducers/userReducer";

import userReducer from "../Reducers/userReducer";
import controlsReducer, { controlsState } from "../Reducers/controlsReducer";

export interface StoreState {
  user: userReducerState;
  controls: controlsState;
}

export default combineReducers<StoreState>({
  user: userReducer,
  controls: controlsReducer,
});
