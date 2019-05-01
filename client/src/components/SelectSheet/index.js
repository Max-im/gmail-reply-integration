import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { getSheets } from "../../store/actions/input";
import Overlay from "../General/Overlay";
import "./style.scss";

export class SheetsList extends Component {
  componentDidMount() {
    const { sheetName } = this.props.match.params;
    this.props.getSheets(sheetName);
  }

  static propTypes = {
    input: PropTypes.object.isRequired,
    getSheets: PropTypes.func.isRequired
  };

  render() {
    const { sheets, sheetsReady, sheetError } = this.props.input;
    const { sheetName } = this.props.match.params;

    return (
      <div className="page" data-test="sheetList">
        <h1
          className="display-4 text-center page__title"
          data-test="sheetList__title"
        >
          Select Sheet
        </h1>
        <section className="section container selectSheet">
          <h3
            className="bg-secondary text-center rounded text-white page__subtitle"
            data-test="sheetList__subtitle"
          >
            Sheets
          </h3>

          {sheetsReady ? (
            <div className="sheetList" data-test="sheetList__content">
              <a
                data-test="sheetList__outLink"
                className="sheetList__title"
                href={`https://docs.google.com/spreadsheets/d/${sheetName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-file-excel" />
                Open the File
              </a>

              <ul className="sheetList__inner" data-test="sheetList__list">
                {sheets.map(item => (
                  <Link
                    key={item.sheetId}
                    data-test="sheetList__item"
                    className="sheetList__item"
                    to={`/integration/file/launch/${sheetName}/${item.title}`}
                  >
                    <div className="sheetList__wrap">
                      <i className="far fa-file sheetList__icon" />
                      <p
                        style={{ wordWrap: "break-word" }}
                        data-test="sheetList__itemText"
                      >
                        {item.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </ul>

              <Link
                className="btn btn-warning"
                to="/integration/file"
                data-test="sheetList__back"
              >
                Select other file
              </Link>
            </div>
          ) : (
            <Overlay data-test="sheetList__overlay" />
          )}
          {sheetError && (
            <p
              className="error selectSheet__error"
              data-test="sheetList__error"
            >
              {sheetError}
            </p>
          )}
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  input: state.input
});

export default connect(
  mapStateToProps,
  { getSheets }
)(withRouter(SheetsList));
