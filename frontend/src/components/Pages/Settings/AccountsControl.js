import React, { Component } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";

import {
  createAccount,
  removeAccount,
  uploadAccountData
} from "../../../store/actions/settingsActions";

class AccountsControl extends Component {
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
            {item.isUploaded ? (
              <Moment format="MMM.DD.YYYY">{item.date}</Moment>
            ) : (
              <p
                className="btn btn-warning"
                onClick={this.props.uploadAccountData.bind(this, item._id)}
              >
                Upload
              </p>
            )}
          </td>
          <td>
            {" "}
            <p
              className="btn btn-light"
              onClick={this.props.removeAccount.bind(this, item._id)}
            >
              Delete
            </p>{" "}
          </td>
        </tr>
      ));
    }

    return (
      <section className="container section">
        <h3 className="bg-secondary text-center rounded text-white settings__title">
          Accounts Control
        </h3>
        {isVisible && (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Photo</th>
                <th scope="col">Name</th>
                <th scope="col">Upload</th>
                <th scope="col">Remove</th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        )}
        <button className="btn btn-success" onClick={this.props.createAccount}>
          Add
        </button>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings
});

export default connect(
  mapStateToProps,
  { createAccount, removeAccount, uploadAccountData }
)(AccountsControl);
