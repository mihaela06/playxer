import React from "react";
import { useDispatch } from "react-redux";
import { getFollowedArtists } from "../../../_actions/spotify_actions";

function MainPage() {
  const dispatch = useDispatch();

  dispatch(getFollowedArtists())
    .then((response) => {
      console.log(response.payload);
    })
    .catch((err) => {
      console.log(err);
    });

  return <div> Check console </div>;
}

export default MainPage;
