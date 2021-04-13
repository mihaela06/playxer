import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getFollowedArtists } from "../../../../_actions/spotify_actions";

function ArtistsPage(props) {
  const dispatch = useDispatch();
  const [nr, setNr] = useState(0);
  const [str, setStr] = useState("");
  var temp = "Ten of them: ";

  dispatch(getFollowedArtists())
    .then((response) => {
      setNr(response.payload.spotifyData.body.artists.total);
      console.log("Response", response);
      response.payload.spotifyData.body.artists.items.forEach((element) => {
        temp += "\n" + element.name + ";";
      });
      setStr(temp);
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return (
    <div>
      {" "}
      You are following {nr} artists! {str}{" "}
    </div>
  );
}

export default ArtistsPage;
