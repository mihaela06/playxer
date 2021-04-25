import axios from "axios";
import {
  GET_ALL_TAGS,
  ADD_TAG,
  ASSIGN_TAG,
  UNASSIGN_TAG,
  DELETE_TAG,
  GET_CONTENT_TAGS,
} from "./types";
import { TAG_SERVER } from "../components/Config.js";

export function getAllTags() {
  return axios
    .get(`${TAG_SERVER}/${GET_ALL_TAGS}`)
    .then((response) => response.data);
}

export function addTag(name, color) {
  const dataToSubmit = { name: name, color: color };
  return axios
    .post(`${TAG_SERVER}/${ADD_TAG}`, dataToSubmit)
    .then((response) => response.data);
}

export function assignTag(name, contentId) {
  const dataToSubmit = { tagName: name, contentId: contentId };
  return axios
    .post(`${TAG_SERVER}/${ASSIGN_TAG}`, dataToSubmit)
    .then((response) => response.data);
}

export function unassignTag(name, contentId) {
  const dataToSubmit = { tagName: name, contentId: contentId };
  return axios
    .post(`${TAG_SERVER}/${UNASSIGN_TAG}`, dataToSubmit)
    .then((response) => response.data);
}

export function deleteTag(name) {
  const dataToSubmit = { tagName: name};
  return axios
    .post(`${TAG_SERVER}/${DELETE_TAG}`, dataToSubmit)
    .then((response) => response.data);
}

export function getContentTags(contentId) {
  const dataToSubmit = { contentId: contentId};
  return axios
    .post(`${TAG_SERVER}/${GET_CONTENT_TAGS}`, dataToSubmit)
    .then((response) => response.data);
}
