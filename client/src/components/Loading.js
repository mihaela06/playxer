import React from "react";
import MixIt from "../assets/images/MixIt256.gif";

function Loading(props) {
  return (
    <div className="center-items h-100">
      <img src={MixIt} />
      <p style={{ fontSize: "2rem", fontFamily: "Comic Sans MS" }}>Mixing...</p>
    </div>
  );
}

export default Loading;
