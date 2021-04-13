import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
import { Icon } from "antd";
import { FiUser } from "react-icons/fi";
import { RiPlayListFill, RiAlbumFill } from "react-icons/ri";
import { GiMicrophone } from "react-icons/gi";
import { useSelector } from "react-redux";

import "../../../../styles/Navbar.css";
import logoPlayxer from "../../../../assets/images/Logo.png";

function NavBar(props) {
  const tabs = [
    {
      route: "/artists",
      icon: GiMicrophone,
      label: "Artists",
    },
    {
      route: "/albums",
      icon: RiAlbumFill,
      label: "Albums",
    },
    {
      route: "/playlists",
      icon: RiPlayListFill,
      label: "Playlists",
    },
    {
      route: "/profile",
      icon: FiUser,
      label: "Profile",
    },
  ];

  const user = useSelector((state) => state.user);

  return (
    <div>
      <Nav className="ml-auto sidebar d-none d-lg-block">
        <NavItem className="center-items">
          <img src={logoPlayxer} style={{ width: "12vw" }} />
        </NavItem>
        <NavItem style={{ marginTop: "40px", marginBottom: "15px" }}>
          <NavLink
            to="/artists"
            className="sidebar__link"
            activeClassName="activeLink"
          >
            {" "}
            Artists{" "}
          </NavLink>{" "}
        </NavItem>{" "}
        <NavItem style={{ marginTop: "20px", marginBottom: "15px" }}>
          <NavLink
            to="/albums"
            className="sidebar__link"
            activeClassName="activeLink"
          >
            {" "}
            Albums{" "}
          </NavLink>{" "}
        </NavItem>{" "}
        <NavItem style={{ marginTop: "20px", marginBottom: "15px" }}>
          <NavLink
            to="/playlists"
            className="sidebar__link"
            activeClassName="activeLink"
          >
            {" "}
            Playlists{" "}
          </NavLink>{" "}
        </NavItem>{" "}
        <NavItem style={{ position: "fixed", bottom: "15px" }}>
          <NavLink
            to="/profile"
            className="sidebar__link"
            activeClassName="activeLink"
          >
            {user.userData.username}
          </NavLink>{" "}
        </NavItem>{" "}
      </Nav>
      <Nav className="w-100 navbar fixed-bottom navbar-light d-block d-lg-none bottom-tab-nav">
        <div className=" d-flex flex-row justify-content-around w-100">
          {" "}
          {tabs.map((tab, index) => (
            <NavItem key={`tab-${index}`}>
              <NavLink
                to={tab.route}
                className="nav-link bottom-nav-link center-items"
                activeClassName="activeLink"
              >
                <tab.icon
                  title={tab.label}
                  className="sidebar__icon"
                  size="1.5rem"
                />
              </NavLink>
            </NavItem>
          ))}{" "}
        </div>{" "}
      </Nav>
    </div>
  );
}

export default withRouter(NavBar);
