import React, { useState, useEffect } from "react";
import {
  getPlaylist,
  editPlaylist,
} from "../../../../_actions/playlists_actions";
import Loading from "../../../common/Loading";
import { Row, Col } from "reactstrap";
import TagModal from "../../../common/TagModal";
import { FiEdit3 } from "react-icons/fi";
import { IoRefreshOutline } from "react-icons/io5";

function Playlist({ match, history }) {
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = () => {
      getPlaylist(match.params.playlistId)
        .then(function (response) {
          setTracks(response.tracks);
          setPlaylist({
            ...response.playlist,
            playlistImage: response.playlistImage,
          });
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

  const refreshPlaylist = () => {
    setLoading(true);
    var temp = playlist.ingredients;
    temp.forEach((i) => (i.old = true));
    editPlaylist(
      temp,
      playlist.checkInstrumentals,
      playlist.checkRemixes,
      playlist.name,
      playlist.description,
      playlist.publicPlaylist,
      playlist.playlistId
    )
      .then(function (response) {
        setPlaylist({
          ...response.playlist,
          playlistImage: playlist.playlistImage,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (loading) return <Loading />;

  return (
    <div>
      {playlist && (
        <div className="header-container">
          <Row className="header-container__row" noGutters>
            <Col xs={4} md={3} className="center-items">
              <img
                src={playlist.playlistImage}
                alt={playlist.name}
                className="album__image"
              />
            </Col>
            <Col xs={7} md={8}>
              <p className="album__name">{playlist.name}</p>
            </Col>
            <Col xs={1} className="center-items">
              <div className="playlist__button__div">
                <FiEdit3
                  style={{ fontSize: "30px", cursor: "pointer", margin: "5px" }}
                  className="increase-hover"
                  onClick={() => {
                    history.push({
                      pathname: "/playlists/edit/" + playlist.playlistId,
                      playlist: playlist,
                    });
                  }}
                />
                <IoRefreshOutline
                  style={{ fontSize: "30px", cursor: "pointer", margin: "5px" }}
                  className="increase-hover"
                  onClick={() => {
                    refreshPlaylist();
                  }}
                />
              </div>
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
                  <Row className="track-row">
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
                        <span className="track-row__tag">
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
