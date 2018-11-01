import React, { Component } from "react";
import { connect } from "react-redux";

export class ProgressBar extends Component {
  render() {
    const { currentProcess, currentLoading } = this.props.common;
    return (
      <div className="progressBar-block">
        <div className="container">
          {currentProcess && (
            <h3>
              {currentProcess} - <i>{Math.round(currentLoading * 100)}%</i>
            </h3>
          )}
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: currentLoading * 100 + "%" }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common
});

export default connect(mapStateToProps)(ProgressBar);
