import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import {
  getArtist,
  changeArtistFollowing,
  getArtistAlbums,
} from "../../../../_actions/spotify_actions";
import Loading from "../../../Loading";
import DisplayCard from "./DisplayCard";
import "../../../../styles/Artist.css";

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
          console.log(response);
          setArtistInfo(response.spotifyData.body);
          setFollowing(response.isFollowing);
          getAlbums(response.spotifyData.body.id);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getData();
  }, []);

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
        console.log(response);
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
          <Col
            xs={4}
            md={3}
            style={{ height: "inherit", maxHeight: "inherit" }}
            className="center-items"
          >
            <img
              src={artistInfo.images[1].url}
              alt={artistInfo.name}
              style={{
                height: "90%",
                maxHeight: "30vmin",
                borderRadius: "50%",
              }}
            />
            <button
              className="increase-hover"
              onClick={clickedFollowButton}
              style={{ fontSize: "4vmin" }}
            >
              {following ? "Unfollow" : "Follow"}
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
              {artistInfo.name}
            </p>
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
      </div>
    </div>
  );
}

export default Artist;
