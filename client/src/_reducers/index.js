import { combineReducers } from "redux";
import user from "./user_reducer";
import spotify from "./spotify_reducer";

const rootReducer = combineReducers({
  user,
  spotify,
});

export default rootReducer;
