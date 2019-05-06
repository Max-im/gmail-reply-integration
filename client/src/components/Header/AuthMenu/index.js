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
      <div className="auth" data-test="authMenu">
        {isAuth ? (
          <UserData data-test="authMenu__userData" />
        ) : (
          <Login data-test="authMenu__login" />
        )}
        {error && (
          <p className="auth__error error" data-test="authMenu__error">
            {error}
          </p>
        )}
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
