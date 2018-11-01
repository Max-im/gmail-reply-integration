import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import InputGroup from "../common/InputGroup";
import { onRegister } from "../../actions/auth";

class AddUser extends Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      email: "",
      password: "",
      password2: ""
    };
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const { email, password, password2 } = this.state;
    this.props.onRegister({ email, password, password2 });
    this.setState({ email: "", password: "", password2: "" });
  }

  render() {
    return (
      <div className="container">
        <h3 className="bg-info text-center rounded text-white settings__title">
          Add User
        </h3>
        <form className="row" onSubmit={this.onSubmit}>
          <div className="col-md-6">
            <InputGroup
              type="email"
              title="Email"
              name="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.onChange}
            />
          </div>
          <div className="col-md-6">
            <InputGroup
              type="password"
              title="Password"
              name="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.onChange}
            />
          </div>

          <div className="col-md-6">
            <InputGroup
              type="password"
              title="Confirm Password"
              name="password2"
              placeholder="Confirm Password"
              value={this.state.password2}
              onChange={this.onChange}
            />
          </div>
          <div className="col-md-6 pt-4">
            <button className="btn btn-success">Register new User</button>
          </div>
        </form>
      </div>
    );
  }
}

AddUser.propTypes = {
  onRegister: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { onRegister }
)(AddUser);
