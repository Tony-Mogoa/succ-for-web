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
        </div>
    );
};

export default AuthBox;
