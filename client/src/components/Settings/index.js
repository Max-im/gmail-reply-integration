import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Overlay from "../General/Overlay";
import AccountsControl from "./AccountsControl";
import LabelsControl from "./LabelsControl";

export class Settings extends Component {
  static propTypes = {
    labels: PropTypes.object.isRequired,
    accounts: PropTypes.object.isRequired
  };

  render() {
    const { inProcess: lablInProcess } = this.props.labels;
    const { inProcess: accInProcess } = this.props.accounts;
    const isReady = !accInProcess && !lablInProcess;

    return (
      <div className="page" data-test="settings">
        <h1
          className="display-4 text-center page__title"
          data-test="settings__title"
        >
          Settings
        </h1>
        <AccountsControl data-test="settings__accounts" />
        <LabelsControl data-test="settings__labels" />
        {!isReady && <Overlay data-test="settings__overlay" />}
      </div>
    );
  }
}

const mapStatesToProps = state => ({
  labels: state.labels,
  accounts: state.accounts
});

export default connect(mapStatesToProps)(Settings);
