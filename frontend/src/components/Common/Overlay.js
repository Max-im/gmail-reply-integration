import React from "react";
import Spinner from "./Spinner";

export default function Overlay() {
  return (
    <div className="overlay">
      <div className="overlay__inner">
        <Spinner />
      </div>
    </div>
  );
}
