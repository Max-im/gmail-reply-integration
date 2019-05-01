import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { onLaunch } from "../../store/actions/integration";
import { withRouter } from "react-router-dom";
import "./style.scss";
import Progress from "../Progress";

export class Integration extends Component {
  componentDidMount() {
    const { sheetName, fileId } = this.props.match.params;
    this.props.onLaunch(fileId, sheetName);
  }

  static propTypes = {
    onLaunch: PropTypes.func.isRequired,
    integration: PropTypes.object.isRequired
  };

  render() {
    const { actions, showProgress } = this.props.integration;
    const { fileId } = this.props.match.params;
    return (
      <div className="page integration" data-test="integration">
        <h1
          className="display-4 text-center page__title"
          data-test="integration__title"
        >
          Integration
        </h1>
        <section className="section">
          <h3
            className="bg-secondary text-center rounded text-white page__subtitle"
            data-test="integration__subtitle"
          >
            Output data
          </h3>
          <div className="integration__file">
            <a
              href={`https://docs.google.com/spreadsheets/d/${fileId}`}
              target="_blank"
              rel="noopener noreferrer"
              data-test="integration__fileLink"
            >
              <i className="fas fa-file-excel" />
              Open the File
            </a>
          </div>
          <ul className="actions" data-test="integration__actionsList">
            {actions.map((action, i) => (
              <li
                key={action.text}
                data-test="integration__action"
                className={
                  "actions__item " +
                  (action.type === "error" && "actions__item_error ")
                }
              >
                <div
                  className="actions__inner"
                  data-test="integration__actionInner"
                >
                  <p
                    className="actions__number"
                    data-test="integration__actionNumber"
                  >
                    {i + 1}
                  </p>
                  <p
                    className="actions__text"
                    data-test="integration__actionText"
                  >
                    {action.text}
                  </p>
                </div>
                <p
                  className={
                    "actions__status" +
                    (action.type === "error"
                      ? " actions__status_error"
                      : " actions__status_info")
                  }
                >
                  {action.type === "error" ? (
                    <i className="fas fa-times" data-test="integration__icon" />
                  ) : (
                    <i className="fas fa-check" data-test="integration__icon" />
                  )}
                </p>
              </li>
            ))}
          </ul>
          {showProgress && <Progress data-test="integration__progress" />}
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  integration: state.integration
});

export default connect(
  mapStateToProps,
  { onLaunch }
)(withRouter(Integration));
