import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  uploadFileNames,
  onGetSheets
} from "../../../store/actions/integrationActions";
import { getAccoutns } from "../../../store/actions/settingsActions";

export class FilesList extends Component {
  state = {
    search: ""
  };

  componentDidMount() {
    const { filesReady } = this.props.integration;
    if (!filesReady) {
      this.props.uploadFileNames();
    }

    // load accounts to check is the accounts uploaded
    const { accounts } = this.props.settings;
    if (accounts.length === 0) {
      this.props.getAccoutns(false);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  static propTypes = {
    uploadFileNames: PropTypes.func.isRequired,
    onGetSheets: PropTypes.func.isRequired,
    getAccoutns: PropTypes.func.isRequired,
    integration: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  render() {
    const { files, filesReady } = this.props.integration;
    const search = this.state.search;

    let filtred;
    if (search.trim() === "") {
      filtred = files;
    } else {
      const reg = new RegExp(search, "gi");
      filtred = files.filter(item => item.name.match(reg));
    }

    let textMessage = "";

    if (filesReady) {
      if (filtred.length > 0) {
        textMessage = "";
      } else if (files.length === 0) {
        textMessage = "Files not found";
      } else {
        textMessage = search + " not found";
      }
    }

    return (
      <section className="section container">
        <h3 className="bg-secondary text-center rounded text-white settings__title">
          {filesReady ? (
            <span>Found {filtred.length} files</span>
          ) : (
            <span>Files</span>
          )}
        </h3>

        {filesReady && (
          <Fragment>
            {/* input */}
            <input
              type="text"
              name="search"
              autoComplete="off"
              value={this.state.search}
              className="fileList__search form-control"
              placeholder="Enter the name"
              onChange={this.onChange.bind(this)}
            />

            {/* files list */}
            <ul className="fileList">
              {filtred
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map(item => (
                  <li key={item.id} className="fileList__item">
                    <p
                      className="fileList__text"
                      onClick={this.props.onGetSheets.bind(this, item)}
                    >
                      <i className="fas fa-file-excel" />
                      {item.name}
                    </p>
                    <a
                      href={`https://docs.google.com/spreadsheets/d/${item.id}`}
                      target="_blank"
                      rel="nofollow"
                      className="fileList__id"
                    >
                      {item.id}
                    </a>
                  </li>
                ))}
            </ul>
          </Fragment>
        )}
        <p>{textMessage}</p>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  integration: state.integration,
  settings: state.settings
});

export default connect(
  mapStateToProps,
  { uploadFileNames, onGetSheets, getAccoutns }
)(FilesList);
