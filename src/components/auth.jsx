import React, { Component } from "react";
import AuthBox from "./authCodeTextBox";

class Auth extends Component {
    state = {
        username: "",
        authCode: "",
        noCode: false,
        codeCorrect: false,
        submitted: false,
    };

    componentDidMount() {
        if (localStorage.getItem("onBoardComplete")) {
            this.props.history.push(`/hymns`);
        }
    }

    createUser = (name) => {
        const userId = this.props.db.ref("users").push().key;
        this.props.db.ref("users/" + userId).set(
            {
                username: name,
            },
            function (error) {
                if (error) {
                    // The write failed...
                } else {
                    localStorage.setItem("userId", userId);
                }
            }
        );
    };

    pullAuthCodes = (snapshot) => {
        snapshot.forEach(this.compareWithAuthCodes);
        this.setState({ submitted: true });
        if (this.state.codeCorrect) {
            this.createUser(this.state.username);
            //this.props.history.push(`/signIn`);
            localStorage.setItem("onBoardComplete", true);
            this.props.history.push(`/hymns`);
        } else {
            this.btn.removeAttribute("disabled");
        }
    };

    compareWithAuthCodes = (childSnapshot) => {
        if (childSnapshot.val().code === this.state.authCode) {
            this.setState({ codeCorrect: true });
            localStorage.setItem("userType", childSnapshot.val().userType);
            //localStorage.setItem("onBoardComplete", true);
        }
    };

    handleChange = (event) => {
        const input = event.target;
        const value = input.type === "checkbox" ? input.checked : input.value;
        this.setState({ [input.name]: value });
    };

    handleFormSubmit = (event) => {
        event.preventDefault();
        this.btn.setAttribute("disabled", "disabled");
        const { username } = this.state;
        if (!this.state.noCode) {
            this.props.db
                .ref("authCodes")
                .once("value")
                .then(this.pullAuthCodes);
        } else {
            this.createUser(username);
            //localStorage.setItem("onBoardComplete", true);
            //this.props.history.push(`/signIn`);
            localStorage.setItem("onBoardComplete", true);
            this.props.history.push(`/hymns`);
        }
    };

    renderCodeIncorrectMessage = () => {
        if (
            !this.state.codeCorrect &&
            this.state.submitted &&
            !this.state.noCode
        ) {
            return (
                <div className="alert alert-danger" role="alert">
                    The code you've entered isn't correct.
                </div>
            );
        }
    };

    renderAuthBox = () => {
        if (!this.state.noCode) {
            return (
                <AuthBox
                    code={this.state.authCode}
                    onHandleChange={this.handleChange}
                />
            );
        }
    };

    render() {
        return (
            <div>
                <br />
                <div className="jumbotron">
                    <h1 className="display-4">SUCC</h1>
                    <p className="lead">
                        Strathmore University Chaplaincy Choir
                    </p>
                    <hr className="my-4" />
                    <p>A digital hymnal</p>
                </div>
                {this.renderCodeIncorrectMessage()}
                <form onSubmit={this.handleFormSubmit}>
                    <div className="form-group">
                        <label>Your name</label>
                        <input
                            type="text"
                            value={this.state.username}
                            name="username"
                            onChange={this.handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    {this.renderAuthBox()}
                    {/* <div className="form-group form-check">
                        <input
                            type="checkbox"
                            name="noCode"
                            onChange={this.handleChange}
                            className="form-check-input"
                            checked={this.state.noCode}
                            id="noCode"
                        />
                        <label className="form-check-label" htmlFor="noCode">
                            I dont have any code
                        </label>
                    </div> */}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        ref={(btn) => {
                            this.btn = btn;
                        }}
                    >
                        Submit
                    </button>
                </form>
            </div>
        );
    }
}

export default Auth;
