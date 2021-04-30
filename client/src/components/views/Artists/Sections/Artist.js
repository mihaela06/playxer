import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import {
  getArtist,
  changeArtistFollowing,
  getArtistAlbums,
} from "../../../../_actions/spotify_actions";
import Loading from "../../../common/Loading";
import DisplayCard from "../../../common/DisplayCard";
import TagModal from "../../../common/TagModal";
import "../../../styles/Artists.css";
import { getImageURL } from "../../../../functions/Helpers.js";

function Artist({ match }) {
  const [loading, setLoading] = useState(true);
  const [artistInfo, setArtistInfo] = useState({});
  const [albumsInfo, setAlbumsInfo] = useState([]);
  const [following, setFollowing] = useState(false);
  var totalAlbums = 0;
  var offset = 0;

  useEffect(() => {
    const getData = () => {
      getArtist(match.params.artistId)
        .then((response) => {
          setArtistInfo({
            ...response.spotifyData.body,
            ...{ relatedArtists: response.spotifyData.relatedArtists.artists },
          });
          setFollowing(response.isFollowing);
          getAlbums(response.spotifyData.body.id);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    window.scrollTo({ top: 0, behavior: "smooth" });
    setAlbumsInfo([]);
    setLoading(true);
    getData();
  }, [match]);

  const clickedFollowButton = () => {
    setFollowing(!following);
    var copyArtistInfo = artistInfo;
    if (following) copyArtistInfo.followers.total -= 1;
    else copyArtistInfo.followers.total += 1;
    setArtistInfo(copyArtistInfo);
    changeArtistFollowing(artistInfo.id, following);
  };

  const getAlbums = (artistId) => {
    getArtistAlbums(artistId, offset)
      .then((response) => {
        setAlbumsInfo((albumsInfo) => [
          ...albumsInfo,
          ...response.spotifyData.body.items,
        ]);
        offset += 50;
        totalAlbums = response.spotifyData.body.total;
        if (offset < totalAlbums) getAlbums(artistId);
        else setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (loading)
    return (
      <div className="h-100">
        <Loading />
      </div>
    );

  var albumContainers = [
    { name: "Albums", type: "album", array: [] },
    { name: "Singles", type: "single", array: [] },
    { name: "Compilations", type: "compilation", array: [] },
    { name: "Appears on", type: "appears_on", array: [] },
  ];

  return (
    <div>
      <div className="header-container">
        <Row className="header-container__row" noGutters>
          <Col xs={4} md={3} className="center-items">
            <img
              src={getImageURL("artist", artistInfo.images)}
              className="header__artist__image"
              alt={artistInfo.name}
            />
            <button
              className="increase-hover save__button"
              onClick={clickedFollowButton}
            >
              {following ? "Unfollow" : "Follow"}
            </button>
          </Col>
          <Col xs={8} md={9}>
            <div
              style={{ display: "flex", flexDirection: "row", width: "100%" }}
            >
              <p className="album__name">{artistInfo.name}</p>
              <span className="tag__icon">
                <TagModal contentId={artistInfo.id} contentType="Artist" />
              </span>
            </div>
            <p className="header-container__followers">
              Followers: {artistInfo.followers.total}
            </p>
          </Col>
        </Row>
      </div>
      <div>
        {albumsInfo &&
          albumContainers.map(function (albumType, indexC) {
            var container = (
              <div className="albums-container" key={indexC}>
                <h3>{albumType.name}</h3>
                <Row noGutters>
                  {albumsInfo.map(function (album, index) {
                    if (album.album_group === albumType.type) {
                      if (
                        albumType.array.indexOf(album.name.toLowerCase()) === -1
                      ) {
                        albumType.array.push(album.name.toLowerCase());
                        return (
                          <React.Fragment key={index}>
                            <DisplayCard
                              images={album.images}
                              name={album.name}
                              id={album.id}
                              type="album"
                            />
                          </React.Fragment>
                        );
                      }
                    }
                    return null;
                  })}
                </Row>
              </div>
            );
            if (albumType.array.length > 0) return container;
            else return null;
          })}
        <div className="albums-container">
          <h3>Related artists</h3>
          <Row noGutters>
            {artistInfo.relatedArtists
              .slice(0, 6)
              .map(function (artist, index) {
                return (
                  <React.Fragment key={index}>
                    <DisplayCard
                      images={artist.images}
                      name={artist.name}
                      id={artist.id}
                      type="artist"
                    />
                  </React.Fragment>
                );
              })}
          </Row>
        </div>
      </div>
    </div>
  );
}

export default Artist;
