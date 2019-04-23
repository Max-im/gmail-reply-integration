import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Overlay from "../General/Overlay";
import AccountsControl from "./AccountsControl";
import LabelsControl from "./LabelsControl";

class Settings extends Component {
  static propTypes = {
    labels: PropTypes.object.isRequired,
    accounts: PropTypes.object.isRequired
  };

  render() {
    const { inProcess: lablInProcess } = this.props.labels;
    const { inProcess: accInProcess } = this.props.accounts;
    const isReady = !accInProcess && !lablInProcess;
    return (
      <div className="page">
        <h1 className="display-4 text-center page__title">Settings</h1>
        <AccountsControl />
        <LabelsControl />
        {!isReady && <Overlay />}
      </div>
    );
  }
}

const mapStatesToProps = state => ({
  labels: state.labels,
  accounts: state.accounts
});

export default connect(mapStatesToProps)(Settings);
