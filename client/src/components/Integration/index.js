import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { onLaunch } from "../../store/actions/integration";
import { withRouter, Link } from "react-router-dom";
import "./style.scss";

class Integration extends Component {
  componentDidMount() {
    const { sheetName, fileId } = this.props.match.params;
    this.props.onLaunch(fileId, sheetName);
  }

  static propTypes = {
    onLaunch: PropTypes.func.isRequired,
    integration: PropTypes.object.isRequired
  };

  render() {
    const { actions } = this.props.integration;
    const { fileId } = this.props.match.params;
    return (
      <div className="page integration">
        <h1 className="display-4 text-center page__title">Integration</h1>
        <section className="section">
          <h3 className="bg-secondary text-center rounded text-white page__subtitle">
            Output data
          </h3>
          <div className="integration__file">
            <a
              href={`https://docs.google.com/spreadsheets/d/${fileId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fas fa-file-excel" />
              Open the File
            </a>
          </div>
          <ul className="actions">
            {actions.map((action, i) => (
              <li
                key={action.text}
                className={
                  "actions__item " +
                  (action.type === "error" && "actions__item_error ")
                }
              >
                <div className="actions__inner">
                  <p className="actions__number">{i + 1}</p>
                  <p className="actions__text">{action.text}</p>
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
                    <i class="fas fa-times" />
                  ) : (
                    <i className="fas fa-check" />
                  )}
                </p>
              </li>
            ))}
          </ul>
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
