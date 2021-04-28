import React from "react";
import { withRouter } from "react-router-dom";
import { TiPlus } from "react-icons/ti";

function PlaylistsPage({ history, userPlaylists }) {
  return (
    <div style={{ padding: "3%" }}>
      <h1 style={{ marginLeft: "5%", color: "var(--text-color)" }}>
        Your playlists
      </h1>
      <div className="center-items">
        <span
          onClick={() => {
            history.push("/playlists/new");
          }}
          style={{
            cursor: "pointer",
            border: "solid 3px var(--border)",
            padding: "10px",
            fontSize: "1.5rem",
            borderRadius: "20px",
            fontWeight: "bold",
          }}
          className="increase-hover center-items"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
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
          {userPlaylists.map(function (playlist, index) {
            return (
              <React.Fragment key={index}>
                <div
                  style={{ margin: "20px", cursor: "pointer" }}
                  onClick={() => {
                    history.push("/playlists/" + playlist.playlistId);
                  }}
                >
                  <span
                    className="increase-hover"
                    style={{ fontSize: "1.3rem", fontWeight: "bold" }}
                  >
                    {playlist.name}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default withRouter(PlaylistsPage);
