import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { GoogleAuthorize } from "react-google-authorize";

import { onLogout, onLogin, getLoginCred } from "../../store/actions/auth";

export class AuthMenu extends Component {
  componentDidMount() {
    this.props.getLoginCred();
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    onLogout: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    getLoginCred: PropTypes.func.isRequired
  };

  render() {
    const { isAuth, user, client_id, scope } = this.props.auth;
    console.log(client_id, scope, "client_id, scope");
    return (
      <div>
        {isAuth ? (
          <Fragment>
            <img src={user.avatar} className="login__avatar" alt={user.name} />
            <i
              className="fas fa-sign-out-alt logout"
              onClick={this.props.onLogout}
            />
          </Fragment>
        ) : (
          // login
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
  { onLogout, onLogin, getLoginCred }
)(AuthMenu);
