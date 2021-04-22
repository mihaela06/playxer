import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";

import { getAlbum, changeAlbumSave } from "../../../../_actions/spotify_actions";
import Loading from "../../../Loading";

function Album({ match }) {
  const [albumInfo, setAlbumInfo] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = () => {
      getAlbum(match.params.albumId)
        .then((response) => {
          console.log("album", response);
          setAlbumInfo(response.spotifyData.body);
          setSaved(response.isFollowing);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getData();
  }, []);

  const msToMin = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  const clickedSaveButton = () => {
    setSaved(!saved);
    changeAlbumSave(albumInfo.id, saved);
  };

  if (loading)
    return (
      <div className="h-100">
        <Loading />
      </div>
    );

  return (
    <div>
      <div className="header-container">
        <Row className="header-container__row" noGutters>
          <Col
            xs={4}
            md={3}
            style={{ height: "inherit", maxHeight: "inherit" }}
            className="center-items"
          >
            <img
              src={albumInfo.images[1].url}
              alt={albumInfo.name}
              style={{
                height: "90%",
                maxHeight: "30vmin",
                borderRadius: "10px",
                padding: "5px",
              }}
            />
            <button className="increase-hover" onClick={clickedSaveButton} style={{ fontSize: "4vmin" }}>
              {saved ? "Saved" : "Save"}
            </button>
          </Col>
          <Col xs={8} md={9}>
            <p
              style={{
                fontSize: "8vmin",
                paddingTop: "5%",
                marginBottom: "5%",
                overflow: "clip",
                color: "var(--text-color)",
              }}
            >
              {albumInfo.name}
            </p>
            <p className="header-container__followers">
              Release date: {albumInfo.release_date}
            </p>
          </Col>
        </Row>
      </div>
      <div className="albums-container">
        {albumInfo &&
          albumInfo.tracks.items.map(function (track, index) {
            return (
              <React.Fragment key={index}>
                <Row
                  style={{
                    margin: "10px 0px",
                    fontSize: "1.2rem",
                    width: "100%",
                  }}
                >
                  <Col xs={1} className="p-0 center-items">
                    {index + 1}
                  </Col>
                  <Col xs={9} className="p-0">
                    {track.name}
                  </Col>
                  <Col xs={2} style={{ textAlign: "right" }}>
                    {msToMin(track.duration_ms)}
                  </Col>
                </Row>
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
}

export default Album;
