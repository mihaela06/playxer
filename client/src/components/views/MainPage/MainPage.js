import React, { Suspense } from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import DarkMode from "../../DarkMode";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { Nav, NavItem } from "reactstrap";

import ArtistsPage from "./Sections/ArtistsPage";
import PlaylistsPage from "./Sections/PlaylistsPage";
import NavBar from "./Sections/NavBar";
import ProfilePage from "../ProfilePage/ProfilePage";

function MainPage() {
  let { path, url } = useRouteMatch();

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
                <Route exact path="/playlists" component={PlaylistsPage} />{" "}
                <Route exact path="/profile" component={ProfilePage} />{" "}
              </Switch>{" "}
            </Col>{" "}
          </Row>{" "}
        </Container>{" "}
      </div>{" "}
    </Suspense>
  );
}

export default withRouter(MainPage);
