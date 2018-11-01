import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import InputGroup from "../common/InputGroup";
import { onLogin } from "../../actions/auth";

class Login extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      email: "",
      password: ""
    };
  }

  onSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;
    this.props.onLogin({ email, password }, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <ul className="navbar-nav">
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            id="loginComponent"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Login
          </a>
          <div
            className="dropdown-menu login__dropdown"
            aria-labelledby="loginComponent"
          >
            <form onSubmit={this.onSubmit}>
              <InputGroup
                type="email"
                name="email"
                placeholder="Email"
                onChange={this.onChange}
                title="Email"
                error={this.props.errors.email}
                value={this.state.email}
              />
              <InputGroup
                type="password"
                name="password"
                onChange={this.onChange}
                placeholder="Password"
                error={this.props.errors.password}
                value={this.state.password}
                title="Password"
              />
              <button className="btn btn-info btn-block">Login</button>
            </form>
          </div>
        </li>
      </ul>
    );
  }
}

Login.propTypes = {
  errors: PropTypes.object.isRequired,
  onLogin: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { onLogin }
)(withRouter(Login));
