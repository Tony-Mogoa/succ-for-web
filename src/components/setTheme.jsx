import React, { Component } from "react";

class SetTheme extends Component {
    state = {
        theme: "normal",
        hymnsDone: 0,
        totalHymns: 0,
    };

    getTheme = (snapshot) => {
        this.setState({ theme: snapshot.val() });
    };

    componentDidMount() {
        this.props.setNavTitle("Set Theme");
        this.props.db.ref("theme").on("value", this.getTheme);
    }

    componentWillUnmount() {
        this.props.db.ref("theme").off("value", this.getTheme);
    }

    supplyTheme = () => {
        switch (this.state.theme) {
            case "Blue":
                return "btn-primary";
            case "Red":
                return "btn-danger";
            case "Violet":
                return "bg-violet text-white";
            case "Black":
                return "btn-secondary";
            case "White":
                return "btn-secondary";
            case "Rose":
                return "bg-rose text-white";
            case "Green":
                return "btn-success";
            default:
                return "btn-primary";
        }
    };

    setTheme = (theme) => {
        this.props.db.ref("theme").set(theme);
    };

    refactorVerseSearchTags = () => {
        const { db } = this.props;
        db.ref("searchRedundancy")
            .once("value")
            .then(
                function (snapshot) {
                    this.setState({ totalHymns: snapshot.numChildren() });
                    snapshot.forEach(
                        function (childSnapshot) {
                            //console.log(childSnapshot.val().title);
                            db.ref(`titlesAndVerses/${childSnapshot.key}`)
                                .once("value")
                                .then(
                                    function (versesSnapshot) {
                                        //console.log(versesSnapshot.numChildren());
                                        versesSnapshot.forEach(function (
                                            verseSnapshot
                                        ) {
                                            //console.log(verseSnapshot.val().verseText);
                                            // eslint-disable-next-line
                                            const regexp = /[{}\d()\t,‘\/"':;#$\[\]\n.-]/g;
                                            const verseText = verseSnapshot
                                                .val()
                                                .verseText.replace(regexp, " ");
                                            //console.log(verseText);
                                            const tags = verseText
                                                .toLowerCase()
                                                .split(" ");
                                            //console.log(tags);
                                            tags.forEach((element) => {
                                                console.log(element);
                                                if (element !== "") {
                                                    db.ref(
                                                        `searchRedundancy/${childSnapshot.key}/${element}`
                                                    ).set(true);
                                                }
                                            });
                                        });
                                        this.setState({
                                            hymnsDone: this.state.hymnsDone + 1,
                                        });
                                    }.bind(this)
                                );
                        }.bind(this)
                    );
                }.bind(this)
            );
    };

    refactorPackIds = () => {
        const { db } = this.props;
        db.ref(`packsAndTitles`)
            .once("value")
            .then(
                function (snapshot) {
                    this.setState({ totalHymns: snapshot.numChildren() });
                    snapshot.forEach(
                        function (childSnapshot) {
                            //console.log(childSnapshot.key);
                            childSnapshot.forEach(function (
                                grandChildSnapshot
                            ) {
                                //console.log(grandChildSnapshot.val().title);
                                db.ref(
                                    `searchRedundancy/${grandChildSnapshot.key}/packId`
                                ).set(childSnapshot.key);
                            });
                            this.setState({
                                hymnsDone: this.state.hymnsDone + 1,
                            });
                        }.bind(this)
                    );
                }.bind(this)
            );
    };

    changeCDHTags = () => {
        const { db } = this.props;
        db.ref(`packsAndTitles`)
            .once("value")
            .then(
                function (snapshot) {
                    snapshot.forEach(
                        function (childSnapshot) {
                            //console.log(childSnapshot.key);
                            childSnapshot.forEach(function (
                                grandChildSnapshot
                            ) {
                                if (
                                    grandChildSnapshot.val().hymnal ===
                                    "CDH - Christian Devotions and Hymns"
                                ) {
                                    console.log(
                                        grandChildSnapshot.val().title +
                                            " : " +
                                            grandChildSnapshot.val().hymnal
                                    );
                                    // db.ref(
                                    //     `packsAndTitles/${childSnapshot.key}/${grandChildSnapshot.key}/hymnal`
                                    // ).set("CDH");
                                    // db.ref(
                                    //     `searchRedundancy/${grandChildSnapshot.key}/hymnal`
                                    // ).set("CDH");
                                }
                            });
                            this.setState({
                                hymnsDone: this.state.hymnsDone + 1,
                            });
                        }.bind(this)
                    );
                }.bind(this)
            );
    };

    refactorWrongHymnals = () => {
        const { db } = this.props;
        db.ref(`packsAndTitles`)
            .once("value")
            .then(
                function (snapshot) {
                    this.setState({ totalHymns: snapshot.numChildren() });
                    snapshot.forEach(
                        function (childSnapshot) {
                            //console.log(childSnapshot.key);
                            childSnapshot.forEach(function (
                                grandChildSnapshot
                            ) {
                                //console.log(grandChildSnapshot.val().title);
                                db.ref(
                                    `searchRedundancy/${grandChildSnapshot.key}/hymnal`
                                ).set(grandChildSnapshot.val().hymnal);
                            });
                            this.setState({
                                hymnsDone: this.state.hymnsDone + 1,
                            });
                        }.bind(this)
                    );
                }.bind(this)
            );
    };

    render() {
        return (
            <React.Fragment>
                <br />
                <div className="dropdown">
                    <button
                        className={"btn dropdown-toggle " + this.supplyTheme()}
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        Options
                    </button>
                    <div
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                    >
                        <span
                            className="dropdown-item"
                            onClick={() => this.setTheme("Violet")}
                        >
                            Violet
                        </span>
                        <span
                            className="dropdown-item"
                            onClick={() => this.setTheme("Green")}
                        >
                            Green
                        </span>
                        <span
                            className="dropdown-item"
                            onClick={() => this.setTheme("Blue")}
                        >
                            Blue
                        </span>
                        <span
                            className="dropdown-item"
                            onClick={() => this.setTheme("Red")}
                        >
                            Red
                        </span>
                        <span
                            className="dropdown-item"
                            onClick={() => this.setTheme("Black")}
                        >
                            Black
                        </span>
                        <span
                            className="dropdown-item"
                            onClick={() => this.setTheme("Rose")}
                        >
                            Rose
                        </span>
                        <span
                            className="dropdown-item"
                            onClick={() => this.setTheme("White")}
                        >
                            White
                        </span>
                    </div>
                </div>
                <br></br>
                {/* <button
          className="btn btn-primary"
          onClick={this.refactorVerseSearchTags}
        >
          Repair Verse Search tags
        </button>
        <br />
        <br />
        <button className="btn btn-primary" onClick={this.refactorPackIds}>
          Repair Pack Ids
        </button>
        <br />
        <br />
        <button className="btn btn-primary" onClick={this.refactorWrongHymnals}>
          Repair Hymnal Error
        </button> */}
                {/* <button
                    className="btn btn-primary"
                    onClick={this.changeCDHTags}
                >
                    Change CDH tags
                </button> */}
                <br />
                <br />
                {this.state.totalHymns > 0 && (
                    <div className="alert alert-primary">
                        {this.state.hymnsDone} of {this.state.totalHymns} done
                    </div>
                )}
            </React.Fragment>
        );
    }
}

export default SetTheme;
