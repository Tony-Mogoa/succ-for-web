import React from "react";
const AuthBox = (props) => {
  return (
    <div className="form-group">
      <label>Authentication Key</label>
      <input
        type="text"
        name="authCode"
        value={props.code}
        onChange={props.onHandleChange}
        className="form-control"
        aria-describedby="emailHelp"
      />
      <small id="emailHelp" className="form-text text-muted">
        If you are not a choir member, you dont need a code.
      </small>
    </div>
  );
};

export default AuthBox;
