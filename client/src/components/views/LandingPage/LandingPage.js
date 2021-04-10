import React from "react";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { USER_SERVER } from "../../Config";

function LandingPage() {
  const user = useSelector((state) => state.user);
  console.log("OK");
  if (user.userData && user.userData.isAuth) {
    return <div className="app"> {user.userData.username} </div>;
  } else if (user.userData && !user.userData.isAuth)
    return <div> User not logged in </div>;
  else return <div className="app"> userData null </div>;
}

export default withRouter(LandingPage);
