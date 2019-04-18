import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { toggleLabelAction } from "../../../store/actions/settingsActions";

export class LabelsContorl extends Component {
  render() {
    const { labels, labelsReady } = this.props.settings;
    let content;
    if (labelsReady) {
      content = (
        <table className="labels__table" border="1">
          <thead>
            <tr>
              <th className="centered">#</th>
              <th className="centered">Label</th>
              <th className="centered">Ingore</th>
              <th className="centered">Check</th>
            </tr>
          </thead>
          <tbody>
            {labels
              .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((label, i) => (
                <tr
                  key={label._id}
                  className={
                    label.type === "check" ? "bg-warning text-gray" : ""
                  }
                >
                  <td className="centered">{i + 1}</td>
                  <td className="pl-2">{label.name}</td>
                  <td
                    className="labels__toggleAction centered"
                    onClick={this.props.toggleLabelAction.bind(
                      this,
                      label._id,
                      "ignore"
                    )}
                  >
                    {label.type === "ignore" && (
                      <i className="fas fa-check labels__icon" />
                    )}
                  </td>
                  <td
                    className="labels__toggleAction centered"
                    onClick={this.props.toggleLabelAction.bind(
                      this,
                      label._id,
                      "check"
                    )}
                  >
                    {label.type === "check" && (
                      <i className="fas fa-check labels__icon" />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      );
    }

    return (
      <section className="container section">
        <h3 className="bg-secondary text-center rounded text-white settings__title">
          Labels Control
        </h3>
        {content}
      </section>
    );
  }
}

LabelsContorl.propTypes = {
  settings: PropTypes.object.isRequired,
  toggleLabelAction: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  settings: state.settings
});

export default connect(
  mapStateToProps,
  { toggleLabelAction }
)(LabelsContorl);
