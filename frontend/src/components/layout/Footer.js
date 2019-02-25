import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <p>Copyright &copy; {new Date().getFullYear()}</p>
            <a
              href="https://gmail-reply-connector.gitbook.io/documentation/"
              rel="nofollow"
              target="_blank"
            >
              Documentation
            </a>
          </div>
        </nav>
      </footer>
    );
  }
}
