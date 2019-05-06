import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { onLogout } from "../../../../store/actions/auth";
import "./style.scss";

export class UserData extends Component {
  static propTypes = {
    onLogout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };

  onLogout() {
    if (!window.confirm("Do you want to Logout?")) return;
    this.props.onLogout();
  }

  render() {
    const { user } = this.props.auth;
    return (
      <div className="userData" data-test="userData">
        <img
          src={user.picture}
          className="userData__avatar"
          alt={user.name}
          data-test="userData__img"
        />
        <i
          className="fas fa-sign-out-alt userData__logout"
          onClick={this.onLogout.bind(this)}
          data-test="userData__icon"
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({ auth: state.auth });

export default connect(
  mapStateToProps,
  { onLogout }
)(UserData);
