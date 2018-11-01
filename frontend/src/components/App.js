import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// credentials
import PrivatRoute from "./common/PrivateRoute";

// layout
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Messages from "./Messages/Messages";

// pages
import HomePage from "./layout/HomePage";
import Settings from "./Settings/Settings";
import Integration from "./Integration/Integration";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <Header />
          <Messages />
          <main className="main">
            <div className="container">
              <Route exact path="/" component={HomePage} />

              <Switch>
                <PrivatRoute exact path="/settings" component={Settings} />
              </Switch>

              <Switch>
                <PrivatRoute
                  exact
                  path="/integration"
                  component={Integration}
                />
              </Switch>
            </div>
          </main>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
