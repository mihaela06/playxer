import React, { Suspense, useState } from "react";
import { useSelector } from "react-redux";

import { withRouter } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import DarkMode from "../../DarkMode";

import { Switch, Route } from "react-router-dom";

import ArtistsPage from "./Sections/ArtistsPage";
import PlaylistsPage from "./Sections/PlaylistsPage";
import NewPlaylistPage from "./Sections/NewPlaylistPage";
import NavBar from "./Sections/NavBar";
import ProfilePage from "../ProfilePage/ProfilePage";
import AlbumsPage from "./Sections/AlbumsPage";
import Artist from "./Sections/Artist";
import Album from "./Sections/Album";
import Playlist from "./Sections/Playlist";
import SearchPage from "./Sections/SearchPage";

function MainPage() {
  const user = useSelector((state) => state.user);
  const [userPlaylists, setUserPlaylists] = useState(
    user.userData && user.userData.playlists ? user.userData.playlists : []
  );

  return (
    <Suspense fallback={<div> Loading... </div>}>
      {" "}
      <div className="app">
        <DarkMode />
        <Container fluid>
          <Row>
            <Col id="sidebar-wrapper">
              <NavBar userPlaylists={userPlaylists} />
            </Col>{" "}
            <Col id="page-content-wrapper">
              <Switch>
                <Route exact path="/artists" component={ArtistsPage} />{" "}
                <Route path="/artists/:artistId" component={Artist} />{" "}
                <Route
                  exact
                  path="/playlists"
                  component={() => (
                    <PlaylistsPage userPlaylists={userPlaylists} />
                  )}
                />{" "}
                <Route
                  exact
                  path="/playlists/new"
                  component={() => (
                    <NewPlaylistPage
                      userPlaylists={userPlaylists}
                      setUserPlaylists={setUserPlaylists}
                    />
                  )}
                />{" "}
                <Route path="/playlists/:playlistId" component={Playlist} />{" "}
                <Route exact path="/albums" component={AlbumsPage} />{" "}
                <Route path="/albums/:albumId" component={Album} />{" "}
                <Route exact path="/profile" component={ProfilePage} />{" "}
                <Route exact path="/" component={SearchPage} />{" "}
              </Switch>{" "}
            </Col>{" "}
          </Row>{" "}
        </Container>{" "}
      </div>{" "}
    </Suspense>
  );
}

export default withRouter(MainPage);
