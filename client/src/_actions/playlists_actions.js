import axios from "axios";
import { CREATE_PLAYLIST, GET_PLAYLIST } from "./types";
import { PLAYLIST_SERVER } from "../components/Config.js";

export function createPlaylist(
  ingredients,
  checkInstrumentals,
  checkRemixes,
  playlistName,
  playlistDescription,
  publicPlaylist
) {
  const dataToSubmit = {
    checkInstrumentals: checkInstrumentals,
    checkRemixes: checkRemixes,
    playlistName: playlistName,
    playlistDescription: playlistDescription,
    publicPlaylist: publicPlaylist,
    ingredients: [],
  };

  ingredients.map(function (ingredient) {
    console.log(ingredient);
    let ref =
      ingredient.type === "Tag"
        ? ingredient.content.name
        : ingredient.content.id;
    let imageUrl =
      ingredient.type === "Tag"
        ? null
        : ingredient.type === "Track"
        ? ingredient.content.album.images
          ? ingredient.content.album.images[2]
            ? ingredient.content.album.images[2].url
            : null
          : null
        : ingredient.content.images
        ? ingredient.content.images[2]
          ? ingredient.content.images[2].url
          : null
        : null;
    dataToSubmit.ingredients.push({
      type: ingredient.type,
      reference: ref,
      imageUrl: imageUrl,
    });
  });
  console.log(dataToSubmit);
  return axios
    .post(`${PLAYLIST_SERVER}/${CREATE_PLAYLIST}`, dataToSubmit)
    .then((response) => response.data);
}

export function getPlaylist(playlistId) {
  const dataToSubmit = { playlistId: playlistId };
  return axios
    .post(`${PLAYLIST_SERVER}/${GET_PLAYLIST}`, dataToSubmit)
    .then((response) => response.data);
}
