import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";

import Logo from "../Common/Logo";

export class MainMenu extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  render() {
    const { isAuth } = this.props.auth;
    return (
      <ul className="navbar-nav">
        <li className="nav-item ">
          <Link className="nav-link" to="/">
            <Logo />
          </Link>
        </li>

        {isAuth && (
          <Fragment>
            <li className="nav-item ">
              <NavLink
                className="nav-link"
                to="/settings"
                activeClassName="nav-link_active"
              >
                Settings
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/integration"
                activeClassName="nav-link_active"
              >
                Integration
              </NavLink>
            </li>
          </Fragment>
        )}
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(MainMenu);
