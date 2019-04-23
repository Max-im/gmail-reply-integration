import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Overlay from "../General/Overlay";
import "./style.scss";
import { getFiles } from "../../store/actions/input";

export class FilesList extends Component {
  state = { search: "", onSearch: false };

  componentDidMount() {
    const { filesReady } = this.props.input;
    if (!filesReady) this.props.getFiles();
  }

  static propTypes = {
    getFiles: PropTypes.func.isRequired,
    input: PropTypes.object.isRequired
  };

  render() {
    const { files, filesReady, filesError } = this.props.input;
    const { search, onSearch } = this.state;

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
        textMessage = (
          <p>
            <b>"{search}"</b> not found
          </p>
        );
      }
    }

    return (
      <div className="page selectFile">
        <h1 className="display-4 text-center page__title">Select File</h1>

        <section className="section container selectFile">
          <h3 className="bg-secondary text-center rounded text-white page__subtitle">
            {filesReady ? (
              <span>Found {filtred.length} files</span>
            ) : (
              <span>Files</span>
            )}
          </h3>

          {filesReady && (
            <>
              {/* input */}
              <label
                className={
                  "fileList__search" +
                  (onSearch ? " fileList__search_active" : "")
                }
              >
                <i className="fas fa-search" />
                <input
                  type="text"
                  name="search"
                  autoComplete="off"
                  value={this.state.search}
                  className="fileList__searchForm form-control"
                  placeholder="Enter the name"
                  onFocus={() => this.setState({ onSearch: true })}
                  onBlur={() => this.setState({ onSearch: false })}
                  onChange={e =>
                    this.setState({ [e.target.name]: e.target.value })
                  }
                />
              </label>

              {/* files list */}
              <ul className="fileList">
                {filtred
                  .sort((a, b) => (a.name > b.name ? 1 : -1))
                  .map(item => (
                    <li key={item.id} className="fileList__item">
                      <Link
                        className="fileList__text"
                        to={`/integration/file/${item.id}`}
                      >
                        <i className="fas fa-file-excel" />
                        {item.name}
                      </Link>
                      <a
                        href={`https://docs.google.com/spreadsheets/d/${
                          item.id
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fileList__id"
                      >
                        {item.id}
                      </a>
                    </li>
                  ))}
              </ul>
            </>
          )}
          <p>{textMessage}</p>
          {filesError && (
            <p className="error selectFile__error">{filesError}</p>
          )}
        </section>
        {!filesReady && <Overlay />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  input: state.input,
  accounts: state.accounts
});

export default connect(
  mapStateToProps,
  { getFiles }
)(FilesList);
