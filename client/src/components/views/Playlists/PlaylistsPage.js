import React from "react";
import { withRouter } from "react-router-dom";
import { TiPlus } from "react-icons/ti";
import DisplayCard from "../../common/DisplayCard";
import { Row } from "reactstrap";
import "../../styles/Playlists.css";

function PlaylistsPage({ history, userPlaylists }) {
  return (
    <div style={{ padding: "3%" }}>
      <h1 className="playlist__heading">Your playlists</h1>
      <div className="center-items">
        <span
          onClick={() => {
            history.push("/playlists/new");
          }}
          className="increase-hover center-items playlist__add"
        >
          <div>
            <TiPlus color="green" />
            Create a new playlist
          </div>
        </span>
      </div>
      {userPlaylists.length === 0 && (
        <div style={{ marginTop: "5%" }} className="center-items">
          <h2 style={{ color: "var(--text-color)" }}>
            Mix your first playlist by clicking the button above!
          </h2>
        </div>
      )}
      {userPlaylists.length !== 0 && (
        <div style={{ marginTop: "5%" }}>
          <Row noGutters>
            {userPlaylists.map(function (playlist, index) {
              console.log(playlist);
              return (
                <React.Fragment key={index}>
                  <DisplayCard
                    type="playlist"
                    images={null}
                    name={playlist.name}
                    id={playlist.playlistId}
                  />
                </React.Fragment>
              );
            })}
          </Row>
        </div>
      )}
    </div>
  );
}

export default withRouter(PlaylistsPage);
