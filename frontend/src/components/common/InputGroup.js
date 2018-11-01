import React from "react";

export default ({
  type,
  title,
  name,
  placeholder,
  info,
  error,
  value,
  onChange
}) => {
  return (
    <div className="form-group">
      <label style={{ width: "100%" }}>
        {title}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className="form-control"
          placeholder={placeholder}
        />
      </label>

      {info && <small className="form-text text-muted">{info}</small>}
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};
