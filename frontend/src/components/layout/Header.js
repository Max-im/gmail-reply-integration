import React from "react";
import MainMenu from "./MainMenu";
import AuthMenu from "./AuthMenu";
import { Switch } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          {/* main menu */}
          <Switch>
            <MainMenu />
          </Switch>

          {/* auth menu */}
          <AuthMenu />
        </div>
      </nav>
    </header>
  );
}
