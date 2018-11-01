import React, { Component } from "react";

import AccountsControl from "./AccountsControl";
import UserControl from "./UsersControl";
import AddUser from "./AddUser";

class Settings extends Component {
  render() {
    return (
      <div>
        <h1 className="display-4 text-center">Settings</h1>
        <AccountsControl />
        <UserControl />
        <AddUser />
      </div>
    );
  }
}

export default Settings;
