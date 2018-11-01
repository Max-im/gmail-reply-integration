import React from "react";

export default function SourceToggle({ fromDb, onDbSwitch }) {
  return (
    <div className="container db">
      <div className="db__wrapper">
        {fromDb ? (
          <p className="db__text">From DB</p>
        ) : (
          <p className="db__text">From Gmail</p>
        )}
        <div className="db__switcher" onClick={onDbSwitch}>
          <span
            className={fromDb ? "db__point db__point_active" : "db__point "}
          />
        </div>
      </div>
    </div>
  );
}
