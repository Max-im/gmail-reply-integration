import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { GoogleAuthorize } from "react-google-authorize";
import { client_id, scope } from "../../../../config";
import { onLogin } from "../../../../store/actions/auth";
import "./style.scss";

export class index extends Component {
  static propTypes = {
    prop: PropTypes
  };

  render() {
    return (
      <Fragment>
        <GoogleAuthorize
          clientId={client_id}
          className="login"
          accessType="offline"
          responseType="code"
          scope={scope}
          onSuccess={this.props.onLogin}
          onFailure={this.props.onLogin}
        >
          <i className="fab fa-google login" />
        </GoogleAuthorize>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { onLogin }
)(index);
