import React, { useEffect, useState } from "react";
import { getLikedAlbums } from "../../../../_actions/spotify_actions";
import Loading from "../../../Loading";
import DisplayCard from "./DisplayCard";
import { Row } from "reactstrap";
import { NotificationManager } from "react-notifications";

function AlbumsPage(props) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingExtraData, setLoadingExtraData] = useState({
    loadingExtra: false,
    total: 0,
    offset: 0,
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

    getLikedAlbums(loadingExtraData.offset)
      .then((response) => {
        console.log("Response", loadingExtraData.offset, response);
        setAlbums((albums) => [
          ...albums,
          ...response.spotifyData.body.items,
        ]);
        if (loading) setLoading(false);
        var total = response.spotifyData.body.total;
        var offset = loadingExtraData.offset + 24;
        var loadingExtra = false;
        setLoadingExtraData({
          loadingExtra: loadingExtra,
          total: total,
          offset: offset,
        });
        console.log("albums", albums);
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
        {albums &&
          albums.map((item, index) => (
            <React.Fragment key={index}>
              <DisplayCard
                type="album"
                images={item.album.images}
                name={item.album.name}
                id={item.album.id}
              />{" "}
            </React.Fragment>
          ))}{" "}
      </Row>{" "}
    </div>
  );
}

export default AlbumsPage;
