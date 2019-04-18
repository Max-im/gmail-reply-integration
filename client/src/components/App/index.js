import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// common
import Overlay from "../Common/Overlay";

// credentials
import PrivatRoute from "../Common/PrivateRoute";

// layout
import Header from "../Header";
import Footer from "../Footer";

// messages
import Info from "../Messages/Info";
import Error from "../Messages/Error";
import Success from "../Messages/Success";

// pages
import Home from "../Home";
import Settings from "../Settings";
import Integration from "../Integration";

class App extends Component {
  render() {
    const { inProcess } = this.props.general;

    return (
      <Router>
        <div className="app">
          <Header />

          <main className="main">
            <div className="container">
              <Route exact path="/" component={Home} />

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

          {/* overlay */}
          {inProcess && <Overlay />}

          {/* messages */}
          <Error />
          <Info />
          <Success />
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({ general: state.general });

export default connect(mapStateToProps)(App);
