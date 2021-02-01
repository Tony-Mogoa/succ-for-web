import React, { Component } from "react";
import "react-dates/initialize";
import { Link } from "react-router-dom";
import moment from "moment";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

class HymnsForMass extends Component {
  state = {
    date: moment(),
    MassHymns: [],
    theme: "normal",
    loading: true,
    focused: null,
  };

  checkIfOnBoardIsComplete = () => {
    if (!localStorage.getItem("onBoardComplete")) {
      this.props.history.push(`/`);
    }
  };

  componentDidMount() {
    this.checkIfOnBoardIsComplete();
    const { db } = this.props;
    this.props.setNavTitle("Mass");
    db.ref("theme").on("value", this.getTheme);
    const date = this.state.date.format("MMM D, YYYY");
    db.ref(`MassHymns/${date}`).on("value", this.parseMassHymns);
  }

  componentWillUnmount() {
    this.props.db.ref("theme").off("value", this.getTheme);
    this.props.db.ref("MassHymn").off();
  }

  getMassHymn = (date) => {
    this.props.db.ref("MassHymn").off();
    this.setState({ date });
    const { db } = this.props;
    const chosenDate = date.format("MMM D, YYYY");
    db.ref(`MassHymns/${chosenDate}`).on("value", this.parseMassHymns);
    this.setState({ loading: true });
  };

  parseMassHymns = (snapshot) => {
    const MassHymns = [];
    if (snapshot.numChildren() === 0) {
      this.setState({ MassHymns });
    }
    snapshot.forEach(
      function (childSnapshot) {
        MassHymns.push({
          hymnId: childSnapshot.key,
          title: childSnapshot.val().title,
          hymnNumber: childSnapshot.val().hymnNumber,
          hymnPage: childSnapshot.val().hymnPage,
          hymnal: childSnapshot.val().hymnal,
          index: childSnapshot.val().index,
          type: childSnapshot.val().type,
        });
        const sortedMassHymn = MassHymns.sort((a, b) => a.index - b.index);
        this.setState({ MassHymns: sortedMassHymn });
      }.bind(this)
    );
    this.setState({ loading: false });
  };

  getTheme = (snapshot) => {
    this.setState({ theme: snapshot.val() });
  };

  showHideLoader = () => {
    if (this.state.loading) {
      return (
        <div className="d-flex justify-content-center ">
          <div className="spinner-border text-primary" role="status">
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

  renderNoHymnsMessage = () => {
    const { MassHymns, loading } = this.state;
    return (
      MassHymns.length === 0 &&
      !loading && (
        <div className="alert alert-secondary" role="alert">
          No Hymns for Mass on the date selected
        </div>
      )
    );
  };

  removeFromMass = (hymnId) => {
    const chosenDate = this.state.date.format("MMM D, YYYY");
    this.props.db.ref(`MassHymns/${chosenDate}/${hymnId}`).remove();
  };

  render() {
    let badgeTheme = "badge pt-1 pd-1 px-2 badge-pill " + this.supplyTheme();
    return (
      <React.Fragment>
        <small>Choose Date</small>
        <br />
        <SingleDatePicker
          date={this.state.date} // momentPropTypes.momentObj or null
          onDateChange={(date) => this.getMassHymn(date)} // PropTypes.func.isRequired
          focused={this.state.focused} // PropTypes.bool
          numberOfMonths={1}
          isOutsideRange={() => false}
          onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
          id="your_unique_id" // PropTypes.string.isRequired,
          displayFormat="MMM D, YYYY"
        />
        <hr width="100%"></hr>
        {this.showHideLoader()}
        {this.renderNoHymnsMessage()}
        <ul className="list-group">
          {this.state.MassHymns.map((massHymn) => (
            <li
              key={massHymn.hymnId}
              className="list-group-item list-group-item-action"
            >
              <div className="d-flex w-100 justify-content-between">
                <small className="text-primary">{massHymn.type}</small>
                {localStorage.getItem("userType") > 1 && (
                  <button
                    type="button"
                    className="close"
                    onClick={() => this.removeFromMass(massHymn.hymnId)}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                )}
              </div>
              <div className="link-div">
                <Link
                  to={`/hymn/${massHymn.title}/${massHymn.hymnId}`}
                  className="stretched-link link-in-list"
                >
                  <h5 className="mb-1">{massHymn.title}</h5>
                </Link>
                <div className="d-sm-flex w-100  bd-highlight">
                  <span className={badgeTheme + " m-1 bd-highlight"}>
                    {massHymn.hymnal}
                  </span>
                  <span className={badgeTheme + " m-1 bd-highlight"}>
                    page:{massHymn.hymnPage}
                  </span>
                  <span className={badgeTheme + " m-1 bd-highlight"}>
                    number:{massHymn.hymnNumber}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </React.Fragment>
    );
  }
}

export default HymnsForMass;
