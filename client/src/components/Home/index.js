import React, { Component } from "react";
import bg from "../../img/homePage.png";
import "./style.scss";

export default class HomePage extends Component {
  render() {
    return (
      <div className="home" data-test="home">
        <img src={bg} alt="" className="home__bg" data-test="home__bg" />
        <div className="home__inner">
          <h1
            className="display-4 text-white home__title"
            data-test="home__title"
          >
            Gmail-Reply
          </h1>
          <p
            className="text-white text-uppercase home__subtitle"
            data-test="home__subtitle"
          >
            Integration
          </p>
        </div>
      </div>
    );
  }
}
