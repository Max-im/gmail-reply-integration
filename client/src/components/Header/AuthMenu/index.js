import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import UserData from "./UserData";
import Login from "./Login";

export class AuthMenu extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  render() {
    const { isAuth } = this.props.auth;
    return <div>{isAuth ? <UserData /> : <Login />}</div>;
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(AuthMenu);
