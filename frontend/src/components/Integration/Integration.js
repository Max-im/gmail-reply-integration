import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import InputGroup from "../common/InputGroup";
import SelectGroup from "../common/SelectGroup";
import Spinner from "../common/Spinner";
import SourceToggle from "./SourceToggle";

import {
  onGetFileSheets,
  onHideSheetsNames,
  integrationLaunch,
  onProgressCheck
} from "../../actions/integrationActions";

class Integration extends Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onDbSwitch = this.onDbSwitch.bind(this);
    this.onLaunchIntegration = this.onLaunchIntegration.bind(this);
    this.state = {
      fileId: "",
      sheetName: "",
      fromDb: true
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.integration.sheetsNames !== null &&
      this.state.sheetName.length === 0
    ) {
      this.setState({ sheetName: nextProps.integration.sheetsNames[0] });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onChangeInput(e) {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.value.length === 44) {
      this.props.onGetFileSheets(e.target.value);
    } else {
      this.props.onHideSheetsNames();
      this.setState({ sheetName: "" });
    }
  }

  onDbSwitch() {
    this.setState({ fromDb: !this.state.fromDb });
  }

  onLaunchIntegration(e) {
    e.preventDefault();
    const { fileId, sheetName, fromDb } = this.state;
    this.props.integrationLaunch({ fileId, sheetName, fromDb });
    this.props.onProgressCheck();
  }

  render() {
    const {
      sheetsNames,
      showSpinner,
      progress,
      status
    } = this.props.integration;

    const showProgress = progress !== false;

    return (
      <div className="integration">
        {/* SPINNER */}
        {/* ============================================ */}
        {showSpinner && (
          <div className="overlay">
            <div className="overlay__inner">
              <Spinner />
            </div>
          </div>
        )}

        {/* from DB or GMAIL Toggle */}
        {/* ============================================ */}
        <SourceToggle fromDb={this.state.fromDb} onDbSwitch={this.onDbSwitch} />

        <h3 className="text-center display-4">Integration</h3>

        {/* Integration Form */}
        {/* ============================================ */}
        <form onSubmit={this.onLaunchIntegration} className="container mt-4">
          <div className="row">
            {/* file id input */}
            <div className="col-md-6">
              <InputGroup
                type="text"
                title="SpreadScheet Id"
                name="fileId"
                placeholder="SpreadScheet Id"
                error
                value={this.state.fileId}
                onChange={this.onChangeInput}
              />
            </div>

            {/* sheet names select */}
            <div className="col-md-4">
              <p style={{ margin: "0px" }}>Table Names</p>
              <SelectGroup
                name="sheetName"
                value={this.state.sheetName}
                tableNames={sheetsNames}
                onChange={this.onChange}
              />
            </div>

            {/* Launch Button */}
            <div className="col-md-2">
              <button
                className="btn btn-success btn-block mt-4"
                disabled={this.state.sheetName.length === 0}
              >
                Start
              </button>
            </div>
          </div>
        </form>

        {/* Loading integration data */}
        {showProgress && (
          <div>
            <h3>Progress - {Math.round(progress * 100)}%</h3>
            <p>{status}</p>
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped bg-success"
                role="progressbar"
                style={{ height: "20px", width: progress * 100 + "%" }}
                aria-valuenow={progress * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

Integration.propTypes = {
  integration: PropTypes.object.isRequired,
  onGetFileSheets: PropTypes.func.isRequired,
  onHideSheetsNames: PropTypes.func.isRequired,
  onProgressCheck: PropTypes.func.isRequired,
  integrationLaunch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  integration: state.integration
});

export default connect(
  mapStateToProps,
  {
    onGetFileSheets,
    onHideSheetsNames,
    integrationLaunch,
    onProgressCheck
  }
)(Integration);
