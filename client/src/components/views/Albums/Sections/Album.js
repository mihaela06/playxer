import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import {
  changeAlbumSave,
  getAlbum,
} from "../../../../_actions/spotify_actions";
import Loading from "../../../common/Loading";
import TagModal from "../../../common/TagModal";
import LikeButton from "./LikeButton";
import "../../../styles/Albums.css";
import { getImageURL } from "../../../../functions/Helpers.js";

function Album({ match, history }) {
  const [albumInfo, setAlbumInfo] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = () => {
      getAlbum(match.params.albumId)
        .then((response) => {
          setAlbumInfo({
            ...response.spotifyData.body,
            savedTracks: response.spotifyData.savedTracks,
          });
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
          <Col xs={4} md={3} className="center-items">
            <img
              src={getImageURL("album", albumInfo.images)}
              alt={albumInfo.name}
              className="album__image"
            />
            <button
              className="increase-hover save__button"
              onClick={clickedSaveButton}
            >
              {saved ? "Saved" : "Save"}
            </button>
          </Col>
          <Col xs={8} md={9}>
            <div
              style={{ display: "flex", flexDirection: "row", width: "100%" }}
            >
              <p className="album__name">{albumInfo.name}</p>
              <span className="tag__icon">
                <TagModal contentId={albumInfo.id} contentType="Album" />
              </span>
            </div>
            <p
              className="header-container__artist"
              onClick={() => {
                history.push("/artists/" + albumInfo.artists[0].id);
              }}
            >
              {albumInfo.artists && albumInfo.artists[0].name}
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
                <Row className="track-row">
                  <Col xs={1} className="p-0 center-items">
                    {track.track_number}
                  </Col>
                  <Col xs={7} md={9} className="p-0">
                    {track.name}
                    {track.artists.length > 1 && (
                      <span className="artist-link"> feat. </span>
                    )}
                    {track.artists
                      .filter((a) => a.name !== albumInfo.artists[0].name)
                      .map(function (artist, indexA) {
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
                              {indexA <
                              track.artists.filter(
                                (a) => a.name !== albumInfo.artists[0].name
                              ).length -
                                1
                                ? ","
                                : ""}
                            </span>
                          </React.Fragment>
                        );
                      })}
                  </Col>
                  <Col xs={2} md={1} className="p-0 center-items">
                    <div className="track-row__like">
                      <LikeButton
                        initial={albumInfo.savedTracks[index]}
                        trackId={albumInfo.tracks.items[index].id}
                      />

                      <span className="track-row__tag">
                        <TagModal
                          contentId={albumInfo.tracks.items[index].id}
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
    </div>
  );
}

export default Album;
