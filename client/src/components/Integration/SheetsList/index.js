import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  onLaunch,
  onIntegrationCancel
} from "../../../store/actions/integrationActions";

export class SheetsList extends Component {
  static propTypes = {
    integration: PropTypes.object.isRequired,
    onIntegrationCancel: PropTypes.func.isRequired,
    onLaunch: PropTypes.func.isRequired
  };

  render() {
    const { sheets, theFile, sheetsReady } = this.props.integration;

    return (
      <section className="section container">
        <h3 className="bg-secondary text-center rounded text-white settings__title">
          Sheets
        </h3>

        {sheetsReady && (
          <Fragment>
            <h5 className="sheetList__title">
              <i className="fas fa-file-excel" />
              {theFile.name}
            </h5>
            <ul className="sheetList">
              {sheets.map(item => (
                <li
                  key={item.sheetId}
                  className="sheetList__item"
                  onClick={this.props.onLaunch.bind(this, item.title)}
                >
                  <div className="sheetList__wrap">
                    <i className="far fa-file sheetList__icon" />
                    <p style={{ wordWrap: "break-word" }}>{item.title}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p
              className="btn btn-warning"
              onClick={this.props.onIntegrationCancel.bind(this)}
            >
              Cancel
            </p>
          </Fragment>
        )}
      </section>
    );
  }
}

const mapStateToProps = state => ({
  integration: state.integration
});

export default connect(
  mapStateToProps,
  { onLaunch, onIntegrationCancel }
)(SheetsList);
