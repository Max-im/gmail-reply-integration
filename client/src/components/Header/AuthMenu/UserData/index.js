import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { onLogout } from "../../../../store/actions/auth";
import "./style.scss";

export class index extends Component {
  static propTypes = {
    onLogout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };

  render() {
    const { user } = this.props.auth;
    return (
      <Fragment>
        <img src={user.avatar} className="userData__avatar" alt={user.name} />
        <i
          className="fas fa-sign-out-alt userData__logout"
          onClick={this.props.onLogout}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({ auth: state.auth });

export default connect(
  mapStateToProps,
  { onLogout }
)(index);
