import React from "react";
import { useDispatch } from "react-redux";
import { connectUser } from "../../../_actions/user_actions";

function ConnectPage() {
  const dispatch = useDispatch();

  dispatch(connectUser())
    .then((response) => {
      console.log(response.payload.link);
      window.location = response.payload.link;
    })
    .catch((err) => {
      console.log(err);
    });

  return <div> </div>;
}

export default ConnectPage;
