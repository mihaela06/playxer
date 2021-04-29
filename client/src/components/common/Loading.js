import React from "react";
import MixIt from "../../assets/images/MixIt256.gif";

function Loading(props) {
  return (
    <div className="center-items" style={{ height: "85vh" }}>
      <img src={MixIt} alt="Loading..." />
      <p className="loading-text">Mixing...</p>
    </div>
  );
}

export default Loading;
