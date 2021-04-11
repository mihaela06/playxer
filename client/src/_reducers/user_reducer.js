import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  CONNECT_USER,
  EXCHANGE_CODE,
} from "../_actions/types";

export default function (state = {}, action) {
  switch (action.type) {
    case REGISTER_USER:
      return { ...state, register: action.payload };
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };
    case AUTH_USER:
      return { ...state, userData: action.payload };
    case LOGOUT_USER:
      return { ...state };
    case CONNECT_USER:
      return { ...state };
    case EXCHANGE_CODE:
      return { ...state, connectSuccess: action.payload };
    default:
      return state;
  }
}
