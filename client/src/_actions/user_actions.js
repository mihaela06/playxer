import axios from "axios";
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    CONNECT_USER,
    EXCHANGE_CODE,
    CHANGE_EMAIL,
    CHANGE_PASSWORD,
} from "./types";
import { USER_SERVER } from "../components/Config.js";

export function registerUser(dataToSubmit) {
    const request = axios
        .post(`${USER_SERVER}/${REGISTER_USER}`, dataToSubmit)
        .then((response) => response.data);

    return {
        type: REGISTER_USER,
        payload: request,
    };
}

export function loginUser(dataToSubmit) {
    const request = axios
        .post(`${USER_SERVER}/${LOGIN_USER}`, dataToSubmit)
        .then((response) => response.data);

    return {
        type: LOGIN_USER,
        payload: request,
    };
}

export function auth() {
    const request = axios
        .get(`${USER_SERVER}/${AUTH_USER}`)
        .then((response) => response.data);

    return {
        type: AUTH_USER,
        payload: request,
    };
}

export function logoutUser() {
    const request = axios
        .get(`${USER_SERVER}/${LOGOUT_USER}`)
        .then((response) => response.data);

    return {
        type: LOGOUT_USER,
        payload: request,
    };
}

export function connectUser() {
    return axios.get(`${USER_SERVER}/${CONNECT_USER}`).then((response) => response.data);
}

export function exchangeCode(dataToSubmit) {
    const request = axios
        .post(`${USER_SERVER}/${EXCHANGE_CODE}`, dataToSubmit)
        .then((response) => response.data);
    return {
        type: EXCHANGE_CODE,
        payload: request,
    };
}

export function changeEmail(dataToSubmit) {
    const request = axios
        .post(`${USER_SERVER}/${CHANGE_EMAIL}`, dataToSubmit)
        .then((response) => response.data);
    return {
        type: CHANGE_EMAIL,
        payload: request,
    };
}

export function changePassword(dataToSubmit) {
    const request = axios
        .post(`${USER_SERVER}/${CHANGE_PASSWORD}`, dataToSubmit)
        .then((response) => response.data);
    return {
        type: CHANGE_PASSWORD,
        payload: request,
    };
}