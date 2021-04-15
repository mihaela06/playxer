import axios from "axios";
import { GET_FOLLOWED_ARTISTS } from "./types";
import { SPOTIFY_API } from "../components/Config.js";

export function getFollowedArtists(after) {
    return axios
        .get(`${SPOTIFY_API}/${GET_FOLLOWED_ARTISTS}`, {
            headers: { after: after },
        })
        .then((response) => response.data);
}