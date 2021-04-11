import axios from "axios";
import {
    GET_FOLLOWED_ARTISTS
} from "./types";
import { SPOTIFY_API } from "../components/Config.js";

export function getFollowedArtists() {
    const request = axios
        .get(`${SPOTIFY_API}/${GET_FOLLOWED_ARTISTS}`)
        .then((response) => response.data);

    return {
        type: GET_FOLLOWED_ARTISTS,
        payload: request,
    };
}