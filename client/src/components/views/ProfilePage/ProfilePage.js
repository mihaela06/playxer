import React, { useState, useEffect } from "react";
import { getProfile } from "../../../_actions/spotify_actions";
import Loading from "../../Loading";

import axios from "axios";
import { USER_SERVER } from "../../Config";
import { Container, Row, Col } from "reactstrap";

function ProfilePage(props) {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push("/auth");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  const getData = () => {
    getProfile()
      .then((response) => {
        setProfile(response.spotifyData.body);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (loading)
    return (
      <div className="h-100">
        <Loading />
      </div>
    );

  return (
    <div>
      <div style={{ padding: "5vmin" }}>
        <Row>
          <Col xs={3} className="center-items">
            <img
              src={profile.images ? profile.images[0].url : null}
              alt={profile.display_name}
              style={{ borderRadius: "50%", height: "20vmin" }}
            ></img>
          </Col>
          <Col xs={9}>
            <p style={{ color: "var(--text-color)", fontSize: "8vmin" }}>
              {profile.display_name}
            </p>
            <a onClick={logoutHandler}>
              <button
                style={{
                  backgroundColor: "var(--cadet-blue)",
                  borderRadius: "5px",
                  fontSize: "4vmin",
                  position:"absolute",
                  bottom: "5px"
                }}
                className="increase-hover"
              >
                Logout from Playxer
              </button>{" "}
            </a>{" "}
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ProfilePage;
