import React from "react";
import "./style.scss";

export default function index() {
  return (
    <footer className="footer" data-test="footer">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <p data-test="footer__copyright">
            Copyright &copy; {new Date().getFullYear()}
          </p>
          <div className="documentation" data-test="footer__doc">
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
