import React, { Component } from "react";
import { auth, provider } from "./firebase/firebase";
class SignIn extends Component {
    state = {
        error: "",
    };
    signIn = () => {
        auth.signInWithPopup(provider)
            .then(
                function (result) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    // var token = result.credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;
                    var idx = user.email.lastIndexOf("@");
                    if (
                        idx > -1 &&
                        user.email.slice(idx + 1) === "strathmore.edu"
                    ) {
                        // true if the address ends with yahoo.com
                        // localStorage.setItem("onBoardComplete", true);
                        // this.props.history.push(`/hymns`);
                    } else {
                        this.setState({
                            error:
                                "The email you signed in with is not a strathmore.edu email.",
                        });
                    }
                    // ...
                }.bind(this)
            )
            .catch(function (error) {
                // Handle Errors here.
                // var errorCode = error.code;
                // var errorMessage = error.message;
                // The email of the user's account used.
                // var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                // var credential = error.credential;
                // ...
            });
    };

    render() {
        return (
            <React.Fragment>
                <br />
                <div className="jumbotron">
                    <h5>Let's verify you!</h5>
                    <hr className="my-4"></hr>
                    <p className="text-danger">{this.state.error}</p>
                </div>
                <div className="center-x">
                    <button className="btn btn-success" onClick={this.signIn}>
                        Sign In with Google
                    </button>
                </div>
                <small className="center-x">
                    You need a strathmore.edu email.
                </small>
            </React.Fragment>
        );
    }
}

export default SignIn;
// const SignIn = () => {
//     return (
//
//     );
// };

// export default SignIn;
