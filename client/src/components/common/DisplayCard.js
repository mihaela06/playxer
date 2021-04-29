import React from "react";
import { Link } from "react-router-dom";
import { Col } from "reactstrap";
import DefaultAlbum from "../../assets/images/DefaultAlbum.jpg";
import DefaultArtist from "../../assets/images/DefaultArtist.jpg";
import DefaultPlaylist from "../../assets/images/DefaultPlaylist.jpg";
import "../styles/DisplayCard.css";

import { getImageURL } from "../../functions/Helpers.js";

function DisplayCard(props) {
  let { type, name, images, id } = props;
  var defaultPic;
  var toLink;
  if (type === "artist") {
    defaultPic = DefaultArtist;
    toLink = `/artists/${id}`;
  } else if (type === "album") {
    defaultPic = DefaultAlbum;
    toLink = `/albums/${id}`;
  } else {
    defaultPic = DefaultPlaylist;
    toLink = `/playlists/${id}`;
  }
  var source = getImageURL(type, images);
  return (
    <Col lg={2} md={3} xs={6} className="box">
      <Link to={toLink}>
        <div className="content">
          <img className="display-card__image" alt={name} src={source} />{" "}
          <p className="display-card__text"> {name} </p>{" "}
        </div>{" "}
      </Link>{" "}
    </Col>
  );
}

export default DisplayCard;
