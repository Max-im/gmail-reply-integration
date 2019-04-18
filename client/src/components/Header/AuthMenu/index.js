import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getLoginCred } from "../../../store/actions/auth";
import UserData from "./UserData";
import Login from "./Login";

export class AuthMenu extends Component {
  componentDidMount() {
    const { isAuth } = this.props.auth;
    if (!isAuth) this.props.getLoginCred();
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    getLoginCred: PropTypes.func.isRequired
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
  { getLoginCred }
)(AuthMenu);
