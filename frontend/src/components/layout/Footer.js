import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            Copyright &copy; {new Date().getFullYear()}
          </div>
        </nav>
      </footer>
    );
  }
}
