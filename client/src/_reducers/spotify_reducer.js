import { GET_FOLLOWED_ARTISTS } from "../_actions/types";

export default function (state = {}, action) {
  switch (action.type) {
    case GET_FOLLOWED_ARTISTS:
      return { ...state, data: action.payload };
    default:
      return state;
  }
}
