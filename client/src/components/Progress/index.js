import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./style.scss";

export class Progress extends Component {
  static propTypes = {
    integration: PropTypes.object.isRequired
  };

  render() {
    const { progress, progressTitle } = this.props.integration;
    return (
      <div className="progressBar" data-test="progress">
        <div className="progressBar__inner">
          <h3 className="progressBar__title" data-test="progress__title">
            {progressTitle}
          </h3>
          <div className="progress" data-test="progress__wrapper">
            <div
              data-test="progress__field"
              className="progress-bar progressBar__field"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  integration: state.integration
});

export default connect(mapStateToProps)(Progress);
