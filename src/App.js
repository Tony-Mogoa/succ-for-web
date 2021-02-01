import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/navbar";
import HymnPacks from "./components/hymnPacks";
import HymnList from "./components/hymnList";
import HymnView from "./components/hymnView";
import Auth from "./components/auth";
import AddPack from "./components/addPack";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SetTheme from "./components/setTheme";
import AddHymn from "./components/addHymn";
import { db, storage } from "./components/firebase/firebase";
import AddVerses from "./components/addVerses";
import HymnsForMass from "./components/hymnsForMass";
import Favourites from "./components/favourites";
import UserProvider from "./providers/userProvider";
import SignIn from "./components/signIn";
class App extends Component {
    state = { navTitle: "Sing" };

    setNavTitle = (newNavTitle) => {
        this.setState({ navTitle: this.truncateString(newNavTitle, 20) });
    };

    truncateString(str, num) {
        // If the length of str is less than or equal to num
        // just return str--don't truncate it.
        if (str.length <= num) {
            return str;
        }
        // Return str truncated with '...' concatenated to the end of str.
        let truncatedString = str.slice(0, num) + "...";
        return truncatedString;
    }

    render() {
        return (
            <UserProvider>
                <Router>
                    <React.Fragment>
                        <NavBar db={db} navTitle={this.state.navTitle} />
                        <main className="container">
                            <Switch>
                                <Route
                                    path="/"
                                    exact
                                    render={(props) => (
                                        <Auth db={db} {...props} />
                                    )}
                                />
                                <Route
                                    path="/Mass"
                                    exact
                                    render={(props) => (
                                        <HymnsForMass
                                            setNavTitle={this.setNavTitle}
                                            db={db}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path="/favourites"
                                    exact
                                    render={(props) => (
                                        <Favourites
                                            setNavTitle={this.setNavTitle}
                                            db={db}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path="/signIn"
                                    exact
                                    render={(props) => <SignIn {...props} />}
                                />
                                <Route
                                    path="/hymns"
                                    exact
                                    render={(props) => (
                                        <HymnPacks
                                            setNavTitle={this.setNavTitle}
                                            db={db}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path="/hymns/:packName/:packId"
                                    exact
                                    render={(props) => (
                                        <HymnList
                                            setNavTitle={this.setNavTitle}
                                            db={db}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path="/hymn/:title/:hymnId"
                                    render={(props) => (
                                        <HymnView
                                            setNavTitle={this.setNavTitle}
                                            db={db}
                                            storage={storage}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path="/addPack"
                                    exact
                                    render={(props) => (
                                        <AddPack
                                            setNavTitle={this.setNavTitle}
                                            db={db}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path="/setTheme"
                                    exact
                                    render={(props) => (
                                        <SetTheme
                                            setNavTitle={this.setNavTitle}
                                            db={db}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path="/addHymn"
                                    render={(props) => (
                                        <AddHymn
                                            setNavTitle={this.setNavTitle}
                                            db={db}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path="/addVerses/:hymnId"
                                    exact
                                    render={(props) => (
                                        <AddVerses
                                            setNavTitle={this.setNavTitle}
                                            db={db}
                                            {...props}
                                        />
                                    )}
                                />
                            </Switch>
                        </main>
                    </React.Fragment>
                </Router>
            </UserProvider>
        );
    }
}

export default App;
