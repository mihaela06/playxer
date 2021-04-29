import React, { useEffect, useState } from "react";
import { getFollowedArtists } from "../../../_actions/spotify_actions";
import Loading from "../../common/Loading";
import DisplayCard from "../../common/DisplayCard";
import { Row } from "reactstrap";
import { NotificationManager } from "react-notifications";

function ArtistsPage(props) {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingExtraData, setLoadingExtraData] = useState({
    loadingExtra: false,
    total: 0,
    offset: 0,
    after: "",
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    if (
      loadingExtraData.total < loadingExtraData.offset ||
      loadingExtraData.loadingExtra
    )
      return;
    if (loadingExtraData.total > 0)
      NotificationManager.info("Loading...", "", 500);

    getFollowedArtists(loadingExtraData.after)
      .then((response) => {
        console.log("Response", loadingExtraData.offset, response);
        setArtists((artists) => [
          ...artists,
          ...response.spotifyData.body.artists.items,
        ]);
        if (loading) setLoading(false);
        var total = response.spotifyData.body.artists.total;
        var offset = loadingExtraData.offset + 24;
        var after = response.spotifyData.body.artists.cursors.after;
        var loadingExtra = false;
        setLoadingExtraData({
          loadingExtra: loadingExtra,
          total: total,
          offset: offset,
          after: after,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(function setupListener() {
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
      if (windowBottom >= docHeight - 1 && !loadingExtraData.loadingExtra) {
        getData();
        var temp = loadingExtraData;
        temp.loadingExtra = true;
        setLoadingExtraData(temp);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return function cleanupListener() {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  if (loading)
    return (
      <div className="h-100">
        <Loading />
      </div>
    );

  return (
    <div>
      <Row noGutters>
        {" "}
        {artists &&
          artists.map((artist, index) => (
            <React.Fragment key={index}>
              <DisplayCard
                type="artist"
                images={artist.images}
                name={artist.name}
                id={artist.id}
              />{" "}
            </React.Fragment>
          ))}{" "}
      </Row>{" "}
    </div>
  );
}

export default ArtistsPage;
