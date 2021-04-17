import React from "react";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import "../../../styles/index.css";
import DarkMode from "../../DarkMode";
import MainPage from "../MainPage/MainPage";
import spotifyIcon from "../../../assets/images/SpotifyIcon.png";

function LandingPage() {
  const user = useSelector((state) => state.user);
  console.log(user);
  if (user.userData && user.userData.isAuth) {
    if (!user.userData.connectedSpotify)
      return (
        <div className="app center-items">
          <DarkMode />
          <h1 style={{ color: "var(--text-color)", textAlign: "center" }}>
            First, you have to connect your Spotify account{" "}
          </h1>{" "}
          <a href="/connect">
            <button className="connect-spotify-button login-form-button mx-auto">
              <Container>
                <Row noGutters>
                  <Col xs={11} className="my-auto mx-auto">
                    <p> Connect with Spotify® </p>{" "}
                  </Col>{" "}
                  <Col xs={1} className="my-auto mx-auto">
                    <img src={spotifyIcon} />{" "}
                  </Col>{" "}
                </Row>{" "}
              </Container>{" "}
            </button>{" "}
          </a>{" "}
        </div>
      );
    else return <MainPage />;
  } else if (user.userData && !user.userData.isAuth)
    return <div> User not logged in </div>;
  else return <div className="app"> userData null </div>;
}

export default withRouter(LandingPage);
