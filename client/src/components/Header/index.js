import React from "react";
import MainMenu from "./MainMenu";
import AuthMenu from "./AuthMenu";
import { Switch } from "react-router-dom";
import "./style.scss";

export default function Header() {
  return (
    <header className="header" data-test="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          {/* main menu */}
          <Switch>
            <MainMenu data-test="header__mainMenu" />
          </Switch>

          {/* auth menu */}
          <AuthMenu data-test="header__authMenu" />
        </div>
      </nav>
    </header>
  );
}
