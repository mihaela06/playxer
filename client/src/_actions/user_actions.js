import axios from "axios";
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    CONNECT_USER,
    EXCHANGE_CODE,
} from "./types";
import { USER_SERVER } from "../components/Config.js";

export function registerUser(dataToSubmit) {
    const request = axios
        .post(`${USER_SERVER}/register`, dataToSubmit)
        .then((response) => response.data);

    return {
        type: REGISTER_USER,
        payload: request,
    };
}

export function loginUser(dataToSubmit) {
    const request = axios
        .post(`${USER_SERVER}/login`, dataToSubmit)
        .then((response) => response.data);

    return {
        type: LOGIN_USER,
        payload: request,
    };
}

export function auth() {
    const request = axios
        .get(`${USER_SERVER}/auth`)
        .then((response) => response.data);

    return {
        type: AUTH_USER,
        payload: request,
    };
}

export function logoutUser() {
    const request = axios
        .get(`${USER_SERVER}/logout`)
        .then((response) => response.data);

    return {
        type: LOGOUT_USER,
        payload: request,
    };
}

// export function connectUser() {
//     const request = axios
//         .get(`${USER_SERVER}/connect`)
//         .then((response) => response.data);

//     return {
//         type: CONNECT_USER,
//         payload: request,
//     };
// }

export function connectUser() {
    return axios.get(`${USER_SERVER}/connect`).then((response) => response.data);
}

export function exchangeCode(dataToSubmit) {
    const request = axios
        .post(`${USER_SERVER}/exchange_code`, dataToSubmit)
        .then((response) => response.data);
    return {
        type: EXCHANGE_CODE,
        payload: request,
    };
}