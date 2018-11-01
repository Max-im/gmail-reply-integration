import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Logo from "../common/Logo";
import MainMenu from "./MainMenu";
import Login from "./Login";
import Logout from "./Logout";
import { onLogout } from "../../actions/auth";

class Header extends Component {
  render() {
    const { isAuth, user } = this.props.auth;
    let menuContent;
    if (isAuth) {
      menuContent = <MainMenu />;
    }
    return (
      <header className="header">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link className="nav-link" to="/">
              <Logo />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <div className="mr-auto">{menuContent}</div>
              {isAuth ? (
                <Logout onLogout={this.props.onLogout} email={user.email} />
              ) : (
                <Login />
              )}
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

Header.propTypes = {
  auth: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { onLogout }
)(Header);
