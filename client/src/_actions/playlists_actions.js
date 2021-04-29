import axios from "axios";
import { CREATE_PLAYLIST, GET_PLAYLIST, EDIT_PLAYLIST } from "./types";
import { PLAYLIST_SERVER } from "../components/Config.js";
import { getImageURL } from "../functions/Helpers.js";

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
        ? getImageURL(ingredient.type, ingredient.content.album.images)
        : getImageURL(ingredient.type, ingredient.content.images);
    dataToSubmit.ingredients.push({
      type: ingredient.type,
      reference: ref,
      imageUrl: imageUrl,
      name: ingredient.content.name,
    });
  });
  console.log(dataToSubmit);
  return axios
    .post(`${PLAYLIST_SERVER}/${CREATE_PLAYLIST}`, dataToSubmit)
    .then((response) => response.data);
}

export function editPlaylist(
  ingredients,
  checkInstrumentals,
  checkRemixes,
  playlistName,
  playlistDescription,
  publicPlaylist,
  playlistId
) {
  const dataToSubmit = {
    checkInstrumentals: checkInstrumentals,
    checkRemixes: checkRemixes,
    playlistName: playlistName,
    playlistDescription: playlistDescription,
    publicPlaylist: publicPlaylist,
    playlistId: playlistId,
    ingredients: [],
  };

  console.log(ingredients);

  ingredients.map(function (ingredient) {
    console.log(ingredient);
    if (!ingredient.old) {
      let ref =
        ingredient.type === "Tag"
          ? ingredient.content.name
          : ingredient.content.id;
      let imageUrl =
        ingredient.type === "Tag"
          ? null
          : ingredient.type === "Track"
          ? getImageURL(ingredient.type, ingredient.content.album.images)
          : getImageURL(ingredient.type, ingredient.content.images);
      dataToSubmit.ingredients.push({
        type: ingredient.type,
        reference: ref,
        imageUrl: imageUrl,
        name: ingredient.content.name,
        old: ingredient.old,
      });
    } else dataToSubmit.ingredients.push(ingredient);
  });
  console.log(dataToSubmit);
  return axios
    .post(`${PLAYLIST_SERVER}/${EDIT_PLAYLIST}`, dataToSubmit)
    .then((response) => response.data);
}

export function getPlaylist(playlistId) {
  const dataToSubmit = { playlistId: playlistId };
  return axios
    .post(`${PLAYLIST_SERVER}/${GET_PLAYLIST}`, dataToSubmit)
    .then((response) => response.data);
}
