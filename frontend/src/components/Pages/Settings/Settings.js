import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AccountsControl from "./AccountsControl";
import Overlay from "../../Common/Overlay";
import LabelsContorl from "./LabelsContorl";

import { getAccoutns, getLabels } from "../../../store/actions/settingsActions";

class Settings extends Component {
  componentDidMount() {
    this.props.getAccoutns();
    this.props.getLabels();
  }

  static propTypes = {
    settings: PropTypes.object.isRequired,
    getAccoutns: PropTypes.func.isRequired,
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
            <LabelsContorl />
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
  { getAccoutns, getLabels }
)(Settings);
