import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import logo from "../../../img/logo.png";
import "./style.scss";

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
            <img
              style={{ width: "30px" }}
              src={logo}
              alt="Gmail-Reply-Integration"
            />
          </Link>
        </li>

        {isAuth && (
          <>
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
                to="/integration/file"
                activeClassName="nav-link_active"
              >
                Integration
              </NavLink>
            </li>
          </>
        )}
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(MainMenu);
