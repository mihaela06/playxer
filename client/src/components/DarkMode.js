import React from "react";
import "../styles/DarkMode.css";
import "antd/dist/antd.css";
import { Switch } from "antd";
import { FiSun, FiMoon } from "react-icons/fi";

function DarkMode(props) {
  const body = document.body;
  const lightTheme = "light";
  const darkTheme = "dark";
  let theme;

  if (localStorage) {
    theme = localStorage.getItem("theme");
  }
  if (theme === lightTheme || theme === darkTheme) {
    body.classList.add(theme);
  } else {
    body.classList.add(lightTheme);
  }

  const switchTheme = () => {
    if (theme === darkTheme) {
      body.classList.replace(darkTheme, lightTheme);
      localStorage.setItem("theme", "light");
      theme = lightTheme;
      //   checked = false;
    } else {
      body.classList.replace(lightTheme, darkTheme);
      localStorage.setItem("theme", "dark");
      theme = darkTheme;
      //   checked = true;
    }
    if (props.switchParticle) props.switchParticle();
  };

  const switchVisible = () => {
    const route = window.location.pathname;
    console.log(route);

    if (route === "/profile" || route === "/connect" || route === "/auth")
      return true;
    else return false;
  };

  return (
    switchVisible() && (
      <Switch
        id="darkModeSwitch"
        onChange={() => switchTheme()}
        checkedChildren={<FiMoon />}
        unCheckedChildren={<FiSun />}
        defaultChecked={theme === "dark" ? true : false}
      ></Switch>
    )
  );
}

export default DarkMode;
