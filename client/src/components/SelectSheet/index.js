import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { getSheets } from "../../store/actions/input";
import Overlay from "../General/Overlay";
import "./style.scss";

export class SheetsList extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getSheets(id);
  }

  static propTypes = {
    input: PropTypes.object.isRequired,
    getSheets: PropTypes.func.isRequired
  };

  render() {
    const { sheets, sheetsReady } = this.props.input;
    const { id } = this.props.match.params;

    return (
      <div className="page">
        <h1 className="display-4 text-center page__title">Select Sheet</h1>
        <section className="section container">
          <h3 className="bg-secondary text-center rounded text-white page__subtitle">
            Sheets
          </h3>

          {sheetsReady ? (
            <div className="sheetList">
              <a
                className="sheetList__title"
                href={`https://docs.google.com/spreadsheets/d/${id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-file-excel" />
                Open the File
              </a>

              <ul className="sheetList__inner">
                {sheets.map(item => (
                  <Link
                    key={item.sheetId}
                    className="sheetList__item"
                    to={`/integration/file/launch/${id}/${item.title}`}
                  >
                    <div className="sheetList__wrap">
                      <i className="far fa-file sheetList__icon" />
                      <p style={{ wordWrap: "break-word" }}>{item.title}</p>
                    </div>
                  </Link>
                ))}
              </ul>

              <Link className="btn btn-warning" to="/integration/file">
                Select other file
              </Link>
            </div>
          ) : (
            <Overlay />
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
