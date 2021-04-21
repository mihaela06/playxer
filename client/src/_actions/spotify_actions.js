import axios from "axios";
import {
    GET_FOLLOWED_ARTISTS,
    GET_ARTIST,
    GET_ALBUM,
    CHANGE_ARTIST_FOLLOWING,
    GET_ARTIST_ALBUMS,
    GET_PROFILE,
    GET_LIKED_ALBUMS
} from "./types";
import { SPOTIFY_API } from "../components/Config.js";

export function getFollowedArtists(after) {
    const dataToSubmit = { after: after };
    return axios
        .post(`${SPOTIFY_API}/${GET_FOLLOWED_ARTISTS}`, dataToSubmit)
        .then((response) => response.data);
}

export function getLikedAlbums(after) {
    const dataToSubmit = { after: after };
    return axios
        .post(`${SPOTIFY_API}/${GET_LIKED_ALBUMS}`, dataToSubmit)
        .then((response) => response.data);
}

export function getArtist(artistId) {
    const dataToSubmit = { artistId: artistId };
    return axios
        .post(`${SPOTIFY_API}/${GET_ARTIST}`, dataToSubmit)
        .then((response) => response.data);
}

export function getAlbum(albumId) {
    const dataToSubmit = { albumId: albumId };
    return axios
        .post(`${SPOTIFY_API}/${GET_ALBUM}`, dataToSubmit)
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

export function getProfile() {
    return axios
        .get(`${SPOTIFY_API}/${GET_PROFILE}`)
        .then((response) => response.data);
}