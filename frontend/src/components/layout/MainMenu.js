import React from "react";
import { NavLink } from "react-router-dom";

export default () => {
  return (
    <ul className="navbar-nav">
      <li className="nav-item ">
        <NavLink className="nav-link" to="/settings">
          Settings
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/integration">
          Integration
        </NavLink>
      </li>
    </ul>
  );
};
