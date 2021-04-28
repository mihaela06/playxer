import React, { useState, useEffect } from "react";
import { getPlaylist } from "../../../../_actions/playlists_actions";
import Loading from "../../../Loading";
import { Row, Col } from "reactstrap";
import TagModal from "./TagModal";

function Playlist({ match, history }) {
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = () => {
      getPlaylist(match.params.playlistId)
        .then(function (response) {
          console.log(response);
          setTracks(response.tracks);
          setPlaylist(response.playlist);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    setLoading(true);
    getData();
  }, [match]);

  const msToMin = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  if (loading) return <Loading />;

  return (
    <div>
      {playlist && (
        <div className="header-container">
          <Row className="header-container__row" noGutters>
            <Col
              xs={8}
              style={{ height: "inherit", maxHeight: "inherit" }}
              className="center-items"
            >
              <h1 style={{ color: "var(--text)", margin: "5%" }}>
                {playlist.name}
              </h1>
            </Col>
            <Col
              xs={4}
              style={{ height: "inherit", maxHeight: "inherit" }}
              className="center-items"
            >
              Edit recipe
            </Col>
          </Row>
        </div>
      )}
      {playlist && (
        <div className="albums-container">
          {tracks &&
            tracks.map(function (item, index) {
              let track = item.track;
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
                    <Col xs={7} md={9} className="p-0">
                      {track.name}
                      {track.artists.map(function (artist, indexA) {
                        return (
                          <React.Fragment key={indexA}>
                            <span className="artist-link">
                              {" "}
                              <span
                                onClick={() => {
                                  history.push("/artists/" + artist.id);
                                }}
                                className="artist-link__name"
                              >
                                {artist.name}
                              </span>
                              {indexA < track.artists.length - 1 ? "," : ""}
                            </span>
                          </React.Fragment>
                        );
                      })}
                    </Col>
                    <Col xs={2} md={1} className="p-0 center-items">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          width: "100%",
                        }}
                      >
                        {/* <LikeButton
                          initial={albumInfo.savedTracks[index]}
                          trackId={albumInfo.tracks.items[index].id}
                        /> */}

                        <span
                          style={{
                            justifySelf: "flex-end",
                            marginLeft: "auto",
                            marginTop: "auto",
                            marginBottom: "auto",
                            marginRight: "5%",
                          }}
                        >
                          <TagModal
                            contentId={tracks[index].track.id}
                            contentType="Track"
                            iconSize="1.5rem"
                          />
                        </span>
                      </div>
                    </Col>
                    <Col
                      xs={2}
                      md={1}
                      className="center-items"
                      style={{ textAlign: "right" }}
                    >
                      {msToMin(track.duration_ms)}
                    </Col>
                  </Row>
                </React.Fragment>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default Playlist;
