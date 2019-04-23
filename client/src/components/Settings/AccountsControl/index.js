import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { GoogleAuthorize } from "react-google-authorize";
import { client_id, scope } from "../../../config";
import "./style.scss";
import {
  createAccount,
  removeAccount,
  getAccounts
} from "../../../store/actions/accounts";

export class AccountsControl extends Component {
  componentDidMount() {
    this.props.getAccounts();
  }

  static propTypes = {
    createAccount: PropTypes.func.isRequired,
    accounts: PropTypes.object.isRequired
  };

  render() {
    const { accounts, inProcess, error } = this.props.accounts;

    return (
      <section className="container section accounts">
        <h3 className="bg-secondary text-center rounded text-white page__subtitle">
          Accounts Control
        </h3>
        {!inProcess && (
          <>
            <ul className="accounts__list">
              {/* header */}
              <li key="header" className="accounts__item">
                <p className="accounts__header">#</p>
                <p className="accounts__header">Photo</p>
                <p className="accounts__header">Name</p>
                <p className="accounts__header">Email</p>
                <p className="accounts__header">Delete</p>
              </li>

              {/* body */}
              {accounts.map((item, i) => (
                <li key={item._id} className="accounts__item">
                  <p className="accounts__row">{i + 1}</p>
                  <p className="accounts__row">
                    <img
                      className="accounts__photo"
                      alt={item.name}
                      src={item.picture}
                    />
                  </p>
                  <p className="accounts__row accounts__name"> {item.name}</p>
                  <p className="accounts__row accounts__email"> {item.email}</p>
                  <p className="accounts__row">
                    <i
                      className="fas fa-user-times accounts__remove"
                      onClick={this.props.removeAccount.bind(this, item._id)}
                    />
                  </p>
                </li>
              ))}
            </ul>
            {/* Add account */}
            <div className="accounts__add">
              <GoogleAuthorize
                clientId={client_id}
                className="btn btn-success"
                accessType="offline"
                responseType="code"
                scope={scope}
                onSuccess={this.props.createAccount}
                onFailure={this.props.createAccount}
              >
                <i className="fas fa-user-plus" />
              </GoogleAuthorize>
            </div>
          </>
        )}
        {error && <p className="accounts__error error">{error}</p>}
      </section>
    );
  }
}

const mapStateToProps = state => ({ accounts: state.accounts });

export default connect(
  mapStateToProps,
  { createAccount, getAccounts, removeAccount }
)(AccountsControl);
