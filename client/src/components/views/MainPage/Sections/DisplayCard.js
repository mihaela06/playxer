import React from "react";
import { Link } from "react-router-dom";
import { Col } from "reactstrap";
import DefaultArtist from "../../../../assets/images/DefaultArtist.jpg";
import "../../../../styles/MainPage.css";

function DisplayCard(props) {
  let { type, name, images, id } = props;
  var defaultPic;
  var toLink;
  if (type === "artist") {
    defaultPic = DefaultArtist;
    toLink = `/artists/${id}`;
  } else {
    defaultPic = DefaultArtist;
    toLink = `/albums/${id}`;
  }
  var source = images ? (images[1] ? images[1].url : defaultPic) : defaultPic;
  return (
    <Col lg={2} md={3} xs={6} className="box">
      <Link to={toLink}>
        <div className="content">
          <img
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              objectFit: "cover",
            }}
            alt={name}
            src={source}
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
              fontSize: "1rem",
              width: "90%",
              maxHeight: "80%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
              lineHeight: "1em",
            }}
          >
            {" "}
            {name}{" "}
          </p>{" "}
        </div>{" "}
      </Link>{" "}
    </Col>
  );
}

export default DisplayCard;
