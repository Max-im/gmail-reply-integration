import React from "react";
import spinner from "../../img/spinner.gif";

export default () => {
  return (
    <div className="spinner">
      <img src={spinner} alt="Loading..." />
    </div>
  );
};
