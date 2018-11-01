import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getUsers, onRemoveUser } from "../../actions/settingsActions";
import Spinner from "../common/Spinner";

export class UsersControl extends Component {
  componentDidMount() {
    this.props.getUsers();
  }

  render() {
    const { allUsers } = this.props.settings;
    let usersContent;
    if (allUsers === null) {
      usersContent = <Spinner />;
    } else {
      usersContent = (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Email</th>
              <th scope="col">Control</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user, i) => (
              <tr key={user._id}>
                <th scope="row">{i + 1}</th>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={this.props.onRemoveUser.bind(this, user._id)}
                    className="btn btn-light"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <div className="container">
        <h3 className="bg-info text-center rounded text-white settings__title">
          Users Control
        </h3>
        {usersContent}
      </div>
    );
  }
}

UsersControl.propTypes = {
  settings: PropTypes.object.isRequired,
  getUsers: PropTypes.func.isRequired,
  onRemoveUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  settings: state.settings
});

export default connect(
  mapStateToProps,
  { getUsers, onRemoveUser }
)(UsersControl);
