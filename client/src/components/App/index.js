import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// css
import "./reset.scss";
import "./style.scss";

// credentials
import PrivatRoute from "../Common/PrivateRoute";

// layout
import Header from "../Header";
import Footer from "../Footer";

// pages
import Home from "../Home";
import Settings from "../Settings";
import SelectFile from "../SelectFile";
import SelectSheet from "../SelectSheet";
import Integration from "../Integration";

export default function index() {
  return (
    <Router>
      <div className="app">
        <Header />

        <main className="main">
          <div className="container">
            <Route exact path="/" component={Home} />

            <Switch>
              <PrivatRoute path="/settings" component={Settings} />
            </Switch>

            <Switch>
              <PrivatRoute
                path="/integration/file/launch/:fileId/:sheetName"
                component={Integration}
              />
            </Switch>

            <Switch>
              <PrivatRoute
                exact
                path="/integration/file/:id"
                component={SelectSheet}
              />
            </Switch>

            <Switch>
              <PrivatRoute
                exact
                path="/integration/file"
                component={SelectFile}
              />
            </Switch>
          </div>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
