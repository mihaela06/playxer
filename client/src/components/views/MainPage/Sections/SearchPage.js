import React, { useState, useEffect } from "react";
import { Input, Icon } from "antd";
import MixIt from "../../../../assets/images/MixIt256.gif";
import { search } from "../../../../_actions/spotify_actions";
import DisplayCard from "./DisplayCard";
import { Col, Row } from "reactstrap";

function SearchPage(props) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem("searchTerm") ? localStorage.getItem("searchTerm") : ""
  );
  const [searchResult, setSearchResult] = useState();

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (localStorage) localStorage.setItem("searchTerm", searchTerm);
    if (searchTerm === "") {
      setLoading(false);
      setSearchResult();
    } else {
      setLoading(true);
      search(searchTerm)
        .then((response) => {
          setSearchResult(response.spotifyData.body);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [searchTerm]);

  const containers = [
    { name: "Artists", type: "artist", array: [] },
    { name: "Albums", type: "album", array: [] },
    { name: "Tracks", type: "track", array: [] },
  ];

  const getResultArray = (type) => {
    if (type === "artist") return searchResult.artists.items;
    if (type === "album") return searchResult.albums.items;
    if (type === "track") return searchResult.tracks.items;
  };

  const msToMin = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  return (
    <div className="center-items">
      <Input
        id="search"
        prefix={<Icon type="search" color="var(--text-color)" />}
        placeholder="Search..."
        type="text"
        value={searchTerm}
        onChange={handleChange}
        size="large"
        style={{ marginTop: "20px", width: "90%" }}
        autoComplete="off"
      />{" "}
      {loading && (
        <img
          src={MixIt}
          alt="Loading..."
          className="h-100"
          style={{ marginTop: "40px" }}
        />
      )}
      {searchTerm === "" && (
        <div className="center-items">
          <h2
            style={{
              color: "var(--text-color)",
              marginTop: "10vh",
              textAlign: "center",
            }}
          >
            Begin typing to search tracks, albums or artists in the Spotify
            database
          </h2>
          <img
            src={MixIt}
            alt="Loading..."
            className="h-100"
            style={{ marginTop: "40px" }}
          />
        </div>
      )}
      {searchTerm !== "" && !loading && (
        <div className="center-items">
          {searchResult &&
            containers.map(function (containerType, indexC) {
              var resultFiltered = getResultArray(containerType.type);
              var container = (
                <div
                  className="albums-container"
                  style={{ width: "80vw" }}
                  key={indexC}
                >
                  <h3>{containerType.name}</h3>
                  <Row noGutters>
                    {resultFiltered.map(function (content, index) {
                      if (
                        containerType.array.indexOf(
                          content.name.toLowerCase()
                        ) === -1
                      ) {
                        containerType.array.push(content.name.toLowerCase());
                        if (containerType.type === "track")
                          return (
                            <React.Fragment key={index}>
                              <Row
                                style={{
                                  margin: "10px 0px",
                                  fontSize: "1.2rem",
                                  width: "100%",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  props.history.push(
                                    "/albums/" + content.album.id
                                  );
                                }}
                              >
                                <Col xs={2} md={1} className="p-0 center-items">
                                  <img
                                    src={content.album.images[2].url}
                                    alt={content.album.name}
                                    style={{ height: "40px" }}
                                  />
                                </Col>
                                <Col xs={7} md={9} className="p-0">
                                  {content.name}
                                </Col>
                                <Col xs={3} md={2} style={{ textAlign: "right" }}>
                                  {msToMin(content.duration_ms)}
                                </Col>
                              </Row>
                            </React.Fragment>
                          );
                        else
                          return (
                            <React.Fragment key={index}>
                              <DisplayCard
                                images={content.images}
                                name={content.name}
                                id={content.id}
                                type={containerType.type}
                              />
                            </React.Fragment>
                          );
                      }
                      return null;
                    })}
                  </Row>
                </div>
              );
              if (containerType.array.length > 0) return container;
              else return null;
            })}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
