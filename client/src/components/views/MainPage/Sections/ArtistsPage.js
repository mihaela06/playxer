import React, { useEffect, useState } from "react";
import { getFollowedArtists } from "../../../../_actions/spotify_actions";
import Loading from "../../../Loading";
import DisplayCard from "./DisplayCard";
import { Row, Col } from "reactstrap";

function ArtistsPage(props) {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  var loadingExtra = false;
  var total = 0;
  var offset = 0;
  var after = "";

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  const getData = () => {
    if (total < offset || loadingExtra) return;
    console.log("offset", offset);
    getFollowedArtists(after)
      .then((response) => {
        after = response.spotifyData.body.artists.cursors.after;
        console.log("Response", response);
        console.log([...artists, ...response.spotifyData.body.artists.items]);

        setArtists((artists) => [
          ...artists,
          ...response.spotifyData.body.artists.items,
        ]);
        console.log("loading", loading);
        if (loading) setLoading(false);
        console.log(artists);
        if (total == 0) total = response.spotifyData.body.artists.total;
        offset += 24;
        console.log(after);
        loadingExtra = false;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleScroll = () => {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight - 1) {
      {
        getData();
        loadingExtra = true;
      }
    }
  };

  if (loading)
    return (
      <div className="h-100">
        <Loading />
      </div>
    );

  return (
    <div>
      <Row noGutters>
        {artists &&
          artists.map((artist, index) => (
            <React.Fragment key={index}>
              <DisplayCard
                artistImages={artist.images}
                artistName={artist.name}
              />
            </React.Fragment>
          ))}
      </Row>
    </div>
  );
}

export default ArtistsPage;
