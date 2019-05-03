import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./style.scss";

export class Progress extends Component {
  static propTypes = {
    display: PropTypes.shape({
      actions: PropTypes.array.isRequired,
      showProgress: PropTypes.bool.isRequired,
      progress: PropTypes.number.isRequired,
      progressTitle: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const { progress, progressTitle } = this.props.display;
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
  display: state.display
});

export default connect(mapStateToProps)(Progress);
