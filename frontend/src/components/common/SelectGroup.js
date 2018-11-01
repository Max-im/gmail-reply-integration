import React from "react";

export default ({ tableNames, onChange, name, value }) => {
  return (
    <div className="select-block">
      {tableNames && (
        <select
          onChange={onChange}
          name={name}
          value={value}
          className="custom-select"
        >
          {tableNames.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
