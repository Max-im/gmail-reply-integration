import React, { Component } from "react";
import bg from "../../img/homePage.png";

export default class HomePage extends Component {
  render() {
    return (
      <div className="homepage">
        <img src={bg} alt="" className="homepage__bg" />
        <div className="homepage__textblock">
          <h1 className="display-4 text-white homepage__title">Gmail-Reply</h1>
          <p className="text-white text-uppercase homepage__subtitle">
            Integration
          </p>
        </div>
      </div>
    );
  }
}
