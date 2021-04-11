import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getFollowedArtists } from "../../../_actions/spotify_actions";

function MainPage() {
  const dispatch = useDispatch();
  const [nr, setNr] = useState(0);


  dispatch(getFollowedArtists())
    .then((response) => {
      setNr(response.payload.spotifyData.body.artists.total);
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return <div>You are following {nr} artists!</div>;
}

export default MainPage;
