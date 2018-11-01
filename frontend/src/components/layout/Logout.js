import React from "react";

export default ({ email, onLogout }) => {
  return (
    <ul className="navbar-nav">
      <li className="nav-item active">
        <span className="nav-link text-capitalize">
          Hello, {email.replace(/@idealscorp\.com/g, "").replace(/\./g, " ")}
        </span>
      </li>
      <li className="nav-item active">
        <span className="nav-link logout__link" onClick={onLogout}>
          LogOut
        </span>
      </li>
    </ul>
  );
};
