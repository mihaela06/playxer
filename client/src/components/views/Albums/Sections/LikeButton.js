import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import "../../../styles/Albums.css";
import { changeTrackSave } from "../../../../_actions/spotify_actions";


function LikeButton({ initial, trackId }) {
  const [liked, setLiked] = useState(initial);
  const changeLike = () => {
    var old = liked;
    setLiked(!liked);
    changeTrackSave(trackId, old)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
        setLiked(old);
      });
  };
  return (
    <div>
      {liked && (
        <AiFillHeart className="like-button" onClick={() => changeLike()} />
      )}
      {!liked && (
        <AiOutlineHeart className="like-button" onClick={() => changeLike()} />
      )}
    </div>
  );
}

export default LikeButton;
