import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import UserData from "./UserData";
import Login from "./Login";
import "./style.scss";

export class AuthMenu extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  render() {
    const { isAuth, error } = this.props.auth;
    return (
      <div className="auth">
        {isAuth ? <UserData /> : <Login />}
        {error && <p className="auth__error error">{error}</p>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(AuthMenu);
