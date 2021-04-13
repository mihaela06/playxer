import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { NotificationContainer } from "react-notifications";

import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage";
import AuthPage from "./views/AuthPage/AuthPage";
import ConnectPage from "./views/ConnectPage/ConnectPage";
import CallbackPage from "./views/CallbackPage/CallbackPage";

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <Suspense fallback={<div> Loading... </div>}>
      {" "}
      <div>
        <NotificationContainer />
        <Switch>
          <Route exact path="/auth" component={Auth(AuthPage, false)} />{" "}
          <Route exact path="/connect" component={Auth(ConnectPage, true)} />{" "}
          <Route path="/callback" component={Auth(CallbackPage, true)} />{" "}
          <Route path="/" component={Auth(LandingPage, true)} />{" "}
        </Switch>{" "}
      </div>{" "}
    </Suspense>
  );
}

export default App;
