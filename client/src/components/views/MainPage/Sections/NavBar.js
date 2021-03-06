import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
import { useSelector } from "react-redux";
import { FiUser } from "react-icons/fi";
import { RiPlayListFill, RiAlbumFill, RiHome2Line } from "react-icons/ri";
import { GiMicrophone } from "react-icons/gi";

import "../../../styles/MainPage.css";
import logoPlayxer from "../../../../assets/images/Logo.png";

function NavBar({ userPlaylists }) {
  const user = useSelector((state) => state.user);
  const tabs = [
    {
      route: "/",
      icon: RiHome2Line,
      label: "Home",
    },
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

  return (
    <div>
      <Nav className="ml-auto sidebar d-none d-lg-block">
        <NavItem className="center-items">
          <NavLink to="/">
            <img
              src={logoPlayxer}
              alt="Playxer logo"
              className="navbar__logo"
            />{" "}
          </NavLink>
        </NavItem>{" "}
        <NavItem style={{ marginTop: "40px", marginBottom: "15px" }}>
          <NavLink
            to="/artists"
            className="sidebar__link"
            activeClassName="activeLink"
          >
            Artists
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
        <div className="scrollbar">
          {user.userData &&
            user.userData.isAuth &&
            userPlaylists.map(function (playlist, index) {
              return (
                <React.Fragment key={index}>
                  <NavItem>
                    <NavLink
                      to={"/playlists/" + playlist.playlistId}
                      className="sidebar__link__playlist"
                    >
                      <div className="scrollbox__item">{playlist.name}</div>
                    </NavLink>
                  </NavItem>
                </React.Fragment>
              );
            })}
        </div>
        <NavItem className="navbar__item__profile">
          <NavLink
            to="/profile"
            className="sidebar__link"
            activeClassName="activeLink"
          >
            {user.userData.username}{" "}
          </NavLink>{" "}
        </NavItem>{" "}
      </Nav>{" "}
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
              </NavLink>{" "}
            </NavItem>
          ))}{" "}
        </div>{" "}
      </Nav>{" "}
    </div>
  );
}

export default withRouter(NavBar);
