import React, { useState, useEffect } from "react";
import { getPlaylist } from "../../../../_actions/playlists_actions";
import Loading from "../../../Loading";
import { Row, Col } from "reactstrap";
import TagModal from "./TagModal";
import { FiEdit3 } from "react-icons/fi";

function Playlist({ match, history }) {
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState();
  const [loading, setLoading] = useState(true);
  var playlistImage;

  useEffect(() => {
    const getData = () => {
      getPlaylist(match.params.playlistId)
        .then(function (response) {
          console.log(response);
          setTracks(response.tracks);
          setPlaylist({
            ...response.playlist,
            playlistImage: response.playlistImage,
          });
          setLoading(false);
          playlistImage = response.playlistImage;
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
            <Col xs={2} className="center-items">
              <img
                src={playlist.playlistImage}
                alt={playlist.name}
                style={{
                  maxHeight: "20vh",
                  borderRadius: "10px",
                  margin: "10px",
                }}
              />
            </Col>
            <Col xs={9} style={{ height: "inherit", maxHeight: "inherit" }}>
              <h1 style={{ color: "var(--text)", margin: "5%" }}>
                {playlist.name}
              </h1>
            </Col>
            <Col
              xs={1}
              style={{ height: "inherit", maxHeight: "inherit" }}
              className="center-items"
            >
              <FiEdit3
                style={{ fontSize: "30px", cursor: "pointer" }}
                className="increase-hover"
                onClick={() => {
                  history.push({
                    pathname: "/playlists/edit/" + playlist.playlistId,
                    playlist: playlist,
                  });
                }}
              />
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
