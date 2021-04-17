import ParticleBackground from "./Sections/ParticleBackground";
import LoginForm from "./Sections/LoginForm";
import RegisterForm from "./Sections/RegisterForm";
import { React, useState } from "react";
import { Container, Row, Col } from "reactstrap";

function AuthPage() {
  const [loggingIn, loginVisible] = useState(true);

  const showLogin = () => {
    loginVisible(true);
  };

  const showSignup = () => {
    loginVisible(false);
  };

  return (
    <div className="app center-items">
      <ParticleBackground />
      <Container className="center-items auth-container">
        <Row className="toggle-tab my-auto" noGutters style={{ width: "100%" }}>
          <Col xs={6} style={{ border: "1px" }}>
            <button
              className="toggle-tab__button"
              onClick={showLogin}
              disabled={loggingIn}
            >
              <p> Log in </p>{" "}
            </button>{" "}
          </Col>{" "}
          <Col xs={6} style={{ border: "1px" }}>
            <button
              className="toggle-tab__button"
              onClick={showSignup}
              disabled={!loggingIn}
            >
              <p> Sign up </p>{" "}
            </button>{" "}
          </Col>{" "}
        </Row>{" "}
        <Row>
          <Col>
            {" "}
            {loggingIn && <LoginForm />} {!loggingIn && <RegisterForm />}{" "}
          </Col>{" "}
        </Row>{" "}
      </Container>{" "}
    </div>
  );
}

export default AuthPage;
