import React from "react";
import { connectUser } from "../../../_actions/user_actions";

function ConnectPage() {
  connectUser()
    .then((response) => {
      window.location = response.link;
    })
    .catch((err) => {
      console.log(err);
    });

  return <div> </div>;
}

export default ConnectPage;
