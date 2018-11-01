import React, { Component } from "react";
import { connect } from "react-redux";

import {
  getAccoutns,
  createAccount,
  removeAccount
} from "../../actions/settingsActions";

class AccountsControl extends Component {
  componentDidMount() {
    this.props.getAccoutns();
  }

  render() {
    const { accounts } = this.props.settings;
    const isVisible = accounts.length > 0;
    let content;
    if (isVisible) {
      content = accounts.map((item, i) => (
        <tr key={item._id}>
          <td>{i + 1}</td>
          <td className="account__td">
            <img className="account__img" alt={item.name} src={item.img} />
          </td>
          <td> {item.name} </td>
          <td>
            {" "}
            <button
              className="btn btn-light"
              onClick={this.props.removeAccount.bind(this, item._id)}
            >
              Delete
            </button>{" "}
          </td>
        </tr>
      ));
    }

    return (
      <div className="container mb-4">
        <h3 className="bg-info text-center rounded text-white settings__title">
          Accounts Control
        </h3>
        {isVisible && (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Photo</th>
                <th scope="col">Name</th>
                <th scope="col">Control</th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        )}
        <button className="btn btn-success" onClick={this.props.createAccount}>
          Add
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings
});

export default connect(
  mapStateToProps,
  { getAccoutns, createAccount, removeAccount }
)(AccountsControl);
