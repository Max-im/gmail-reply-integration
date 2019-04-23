import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { GoogleAuthorize } from "react-google-authorize";
import { client_id_user, scope_user } from "../../../../config";
import { onLogin } from "../../../../store/actions/auth";
import "./style.scss";

export class index extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired
  };

  render() {
    console.log(client_id_user, scope_user);
    return (
      <>
        <GoogleAuthorize
          clientId={client_id_user}
          className="login"
          accessType="offline"
          responseType="code"
          scope={scope_user}
          onSuccess={this.props.onLogin}
          onFailure={this.props.onLogin}
        >
          <i className="fab fa-google login" />
        </GoogleAuthorize>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { onLogin }
)(index);
