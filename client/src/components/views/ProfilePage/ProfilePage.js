import React, {useState} from "react";

import axios from "axios";
import { USER_SERVER } from "../../Config";

function ProfilePage(props) {

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push("/auth");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  return (
    <div className="center-items">
      <a onClick={logoutHandler}>
        <button>Logout</button>
      </a>
    </div>
  );
}

export default ProfilePage;
