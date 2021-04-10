import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import LeftMenu from "./Sections/LeftMenu";
import RightMenu from "./Sections/RightMenu";
import { Drawer, Button, Icon } from "antd";
import "./Sections/Navbar.css";
import DarkMode from "../../DarkMode";

function NavBar() {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <nav className="navbar">
      <Container className="navbar__container">
        <Row className="navbar__container__row">
          <Col xs={8} md={11} className="my-auto">
            <h1 className="my-auto navbar__container__row logo"> Playxer </h1>{" "}
          </Col>{" "}
          <Col xs={4} md={1} className="my-auto">
            <DarkMode> </DarkMode>{" "}
          </Col>{" "}
        </Row>{" "}
      </Container>{" "}
    </nav>
  );
}

export default NavBar;
