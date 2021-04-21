import axios from "axios";
import { GET_USERS, DELETE_USER } from "./types";
import { ADMIN_SERVER } from "../components/Config.js";

export function getUsers() {
    return axios
        .get(`${ADMIN_SERVER}/${GET_USERS}`)
        .then((response) => response.data);
}

export function deleteUser(dataToSubmit) {
    return axios
        .post(`${ADMIN_SERVER}/${DELETE_USER}`, dataToSubmit)
        .then((response) => response.data);
}