import axios from "axios";
import {
    GET_FOLLOWED_ARTISTS,
    GET_ARTIST,
    CHANGE_ARTIST_FOLLOWING,
    GET_ARTIST_ALBUMS,
} from "./types";
import { SPOTIFY_API } from "../components/Config.js";

export function getFollowedArtists(after) {
    const dataToSubmit = { after: after };
    return axios
        .post(`${SPOTIFY_API}/${GET_FOLLOWED_ARTISTS}`, dataToSubmit)
        .then((response) => response.data);
}

export function getArtist(artistId) {
    const dataToSubmit = { artistId: artistId };
    return axios
        .post(`${SPOTIFY_API}/${GET_ARTIST}`, dataToSubmit)
        .then((response) => response.data);
}

export function changeArtistFollowing(artistId, following) {
    const dataToSubmit = { artistId: artistId, following: following };
    return axios
        .post(`${SPOTIFY_API}/${CHANGE_ARTIST_FOLLOWING}`, dataToSubmit)
        .then((response) => response.data);
}

export function getArtistAlbums(artistId, offset) {
    const dataToSubmit = { artistId: artistId, offset: offset };
    return axios
        .post(`${SPOTIFY_API}/${GET_ARTIST_ALBUMS}`, dataToSubmit)
        .then((response) => response.data);
}