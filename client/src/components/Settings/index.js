import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Overlay from "../Common/Overlay";
import AccountsControl from "./AccountsControl";
import LabelsControl from "./LabelsControl";

import { getAccounts, getLabels } from "../../store/actions/settingsActions";

class Settings extends Component {
  componentDidMount() {
    const { accounts } = this.props.settings;
    if (accounts.length === 0) {
      this.props.getAccounts(true);
    }
    this.props.getLabels();
  }

  static propTypes = {
    settings: PropTypes.object.isRequired,
    getAccounts: PropTypes.func.isRequired,
    getLabels: PropTypes.func.isRequired
  };

  render() {
    const { labelsReady, accountsReady } = this.props.settings;
    const isReady = accountsReady && labelsReady;
    return (
      <div className="settings">
        {!isReady ? (
          <Overlay />
        ) : (
          <Fragment>
            <h1 className="display-4 text-center mb-4">Settings</h1>
            <AccountsControl />
            <LabelsControl />
          </Fragment>
        )}
      </div>
    );
  }
}

const mapStatesToProps = state => ({
  settings: state.settings
});

export default connect(
  mapStatesToProps,
  { getAccounts, getLabels }
)(Settings);
