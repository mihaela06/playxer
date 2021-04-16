import React from "react";
import { Col } from "reactstrap";
import DefaultArtist from "../../../../assets/images/DefaultArtist.jpg";
import "../../../../styles/MainPage.css";

function DisplayCard(props) {
  let { artistName, artistImages } = props;
  return (
    <Col lg={2} md={3} xs={6} className="box">
      <div className="content">
        <img
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            objectFit: "cover",
          }}
          alt={artistName}
          src={artistImages[1] ? artistImages[1].url : DefaultArtist}
        />{" "}
        <p
          style={{
            position: "absolute",
            bottom: "0",
            padding: "5%",
            textAlign: "left",
            backgroundColor: "rgba(120,120,120,0.8)",
            color: "var(--text-color)",
            textShadow: "0 0 0.3rem var(--background-color-main)",
            fontSize: "1.2rem",
            width: "90%",
          }}
        >
          {" "}
          {artistName}{" "}
        </p>{" "}
      </div>{" "}
    </Col>
  );
}

export default DisplayCard;
