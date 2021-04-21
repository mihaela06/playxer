import React from "react";
import MixIt from "../assets/images/MixIt256.gif";

function Loading(props) {
  return (
    <div className="center-items" style={{ height: "100vh" }}>
      <img src={MixIt} alt="Loading..." />
      <p style={{ fontSize: "2rem", fontFamily: "Comic Sans MS" }}>
        {" "}
        Mixing...{" "}
      </p>{" "}
    </div>
  );
}

export default Loading;
