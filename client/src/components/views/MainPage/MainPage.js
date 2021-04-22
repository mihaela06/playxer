import React, { Suspense } from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import DarkMode from "../../DarkMode";

import { Switch, Route } from "react-router-dom";

import ArtistsPage from "./Sections/ArtistsPage";
import PlaylistsPage from "./Sections/PlaylistsPage";
import NavBar from "./Sections/NavBar";
import ProfilePage from "../ProfilePage/ProfilePage";
import AlbumsPage from "./Sections/AlbumsPage";
import Artist from "./Sections/Artist";
import Album from "./Sections/Album";
import SearchPage from "./Sections/SearchPage";

function MainPage() {
  return (
    <Suspense fallback={<div> Loading... </div>}>
      {" "}
      <div className="app">
        <DarkMode />
        <Container fluid>
          <Row>
            <Col id="sidebar-wrapper">
              <NavBar />
            </Col>{" "}
            <Col id="page-content-wrapper">
              <Switch>
                <Route exact path="/artists" component={ArtistsPage} />{" "}
                <Route path="/artists/:artistId" component={Artist} />{" "}
                <Route exact path="/playlists" component={PlaylistsPage} />{" "}
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
