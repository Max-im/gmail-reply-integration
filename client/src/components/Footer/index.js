import React, { Component } from "react";
import "./style.scss";

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <p>Copyright &copy; {new Date().getFullYear()}</p>
            <div className="documentation">
              <i className="fas fa-book footer__docIcon" />
              <a
                href="https://gmail-reply-connector.gitbook.io/documentation/"
                rel="noopener noreferrer"
                className=" footer__docLink"
                target="_blank"
              >
                Documentation
              </a>
            </div>
          </div>
        </nav>
      </footer>
    );
  }
}
