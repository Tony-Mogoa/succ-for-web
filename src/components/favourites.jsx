import React, { Component } from "react";
import { Link } from "react-router-dom";

class Favourites extends Component {
  state = {
    hymnList: [],
    theme: "normal",
    loading: true,
  };

  getTheme = (snapshot) => {
    this.setState({ theme: snapshot.val() });
  };

  getHymnList = (snapshot) => {
    const hymnList = [];
    snapshot.forEach(function (childSnapshot) {
      hymnList.push({
        hymnId: childSnapshot.key,
        hymnNumber: childSnapshot.val().hymnNumber,
        hymnPage: childSnapshot.val().hymnPage,
        hymnal: childSnapshot.val().hymnal,
        title: childSnapshot.val().title,
      });
    });
    this.setState({ hymnList });
    this.setState({ loading: false });
  };

  checkIfOnBoardIsComplete = () => {
    if (!localStorage.getItem("onBoardComplete")) {
      this.props.history.push(`/`);
    }
  };

  componentDidMount() {
    this.checkIfOnBoardIsComplete();
    this.props.setNavTitle("Favourites");
    const userId = localStorage.getItem("userId");
    const { db } = this.props;
    db.ref(`favorites/${userId}`).on("value", this.getHymnList);
    db.ref("theme").on("value", this.getTheme);
  }

  componentWillUnmount() {
    const { db } = this.props;
    const userId = localStorage.getItem("userId");
    db.ref(`favorites/${userId}`).off("value", this.getHymnList);
    db.ref("theme").off("value", this.getTheme);
  }

  showHideLoader = () => {
    if (this.state.loading) {
      return (
        <div className="d-flex justify-content-center ">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status" hidden>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
  };

  supplyTheme = () => {
    switch (this.state.theme) {
      case "Blue":
        return "badge-primary";
      case "Red":
        return "badge-danger";
      case "Violet":
        return "bg-violet text-white";
      case "Black":
        return "badge-secondary";
      case "White":
        return "badge-secondary";
      case "Rose":
        return "bg-rose text-white";
      case "Green":
        return "badge-success";
      default:
        return "badge-primary";
    }
  };

  supplyTheme = () => {
    switch (this.state.theme) {
      case "Blue":
        return "badge-primary";
      case "Red":
        return "badge-danger";
      case "Violet":
        return "bg-violet text-white";
      case "Black":
        return "badge-secondary";
      case "White":
        return "badge-secondary";
      case "Rose":
        return "bg-rose text-white";
      case "Green":
        return "badge-success";
      default:
        return "badge-primary";
    }
  };

  removeFromFavs = (hymnId) => {
    this.props.db
      .ref(`favorites/${localStorage.getItem("userId")}/${hymnId}`)
      .remove();
  };

  render() {
    let badgeTheme = "badge pt-1 pd-1 px-2 badge-pill " + this.supplyTheme();
    const { hymnList, loading } = this.state;
    return (
      <div>
        <br />
        {this.showHideLoader()}
        {hymnList.length === 0 && !loading && (
          <div className="alert alert-secondary" role="alert">
            No hymns marked as favourite yet.
          </div>
        )}
        <ul className="list-group">
          {this.state.hymnList.map((hymnInList) => (
            <li
              className="list-group-item list-group-item-action"
              key={hymnInList.hymnId}
            >
              <div className="d-flex w-100 justify-content-end">
                {localStorage.getItem("userType") > 1 && (
                  <button
                    type="button"
                    className="close"
                    onClick={() => this.removeFromFavs(hymnInList.hymnId)}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                )}
              </div>
              <div className="link-div">
                <Link
                  to={`/hymn/${hymnInList.title}/${hymnInList.hymnId}`}
                  className="stretched-link link-in-list"
                >
                  <h5 className="mb-1">{hymnInList.title}</h5>
                </Link>
                <div className="d-sm-flex w-100  bd-highlight">
                  <span className={badgeTheme + " m-1 bd-highlight"}>
                    {hymnInList.hymnal}
                  </span>
                  <span className={badgeTheme + " m-1 bd-highlight"}>
                    page:{hymnInList.hymnPage}
                  </span>
                  <span className={badgeTheme + " m-1 bd-highlight"}>
                    number:{hymnInList.hymnNumber}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Favourites;
