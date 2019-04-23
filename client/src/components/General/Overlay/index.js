import React from "react";
import spinner from "../../../img/spinner.gif";
import "./style.scss";

export default function() {
  return (
    <div className="overlay">
      <div className="overlay__inner">
        <img src={spinner} alt="Loading..." />
      </div>
    </div>
  );
}
