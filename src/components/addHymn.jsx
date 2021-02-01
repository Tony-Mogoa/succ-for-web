import React, { Component } from "react";
class AddHymn extends Component {
  state = {
    title: "",
    hymnPage: "",
    hymnNumber: "",
    hymnal: "Blue Hymnal",
    hymnPacks: [],
    emptyTitle: false,
    loading: true,
  };

  componentDidMount() {
    this.props.setNavTitle("Add new hymn");
    this.props.db.ref("hymn_packs").on("value", this.getPacks);
  }

  componentWillUnmount() {
    this.props.db.ref("hymn_packs").off("value", this.getPacks);
  }

  handleChange = (event) => {
    const input = event.target;
    const value =
      input.name === "title"
        ? this.capitalizeEachWord(input.value)
        : input.value;
    this.setState({ [input.name]: value });
  };

  capitalizeEachWord(phrase) {
    return phrase.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  createHymn = (packId) => {
    const { db, history } = this.props;
    const hymnId = db.ref("packsAndTitles").push().key;
    const hymn = {
      title: this.state.title,
      hymnPage: this.state.hymnPage,
      hymnNumber: this.state.hymnNumber,
      hymnal: this.state.hymnal,
    };
    if (hymn.title !== "") {
      db.ref(`packsAndTitles/${packId}/${hymnId}`).set(hymn);
      this.incrementPackSize(packId);
      this.createSearchTags(packId, hymnId, hymn);
      this.clearForm();
      history.push(`/addVerses/${hymnId}`);
      this.createAudioAndMusicScoreProfile(hymnId, db);
    } else {
      this.setState({ emptyTitle: true });
      setTimeout(() => this.setState({ emptyTitle: false }), 3000);
    }
  };

  createAudioAndMusicScoreProfile(hymnId, db) {
    const audios = {
      soprano: false,
      alto: false,
      tenor: false,
      bass: false,
      choir: false,
    };
    const scoreProfile = { hasMusicScore: false };
    db.ref(`audios/${hymnId}`).set(audios);
    db.ref(`musicScores/${hymnId}`).set(scoreProfile);
  }

  renderEmptyTitleAlert() {
    return (
      this.state.emptyTitle && (
        <div className="alert alert-danger fixed-top" role="alert">
          You can't give an empty title.
        </div>
      )
    );
  }

  clearForm = () => {
    this.setState({
      title: "",
      hymnPage: "",
      hymnNumber: "",
      hymnal: "",
    });
  };

  incrementPackSize = (packId) => {
    const { db } = this.props;
    db.ref(`hymn_packs/${packId}/packSize`)
      .once("value")
      .then(function (snapshot) {
        db.ref(`hymn_packs/${packId}/packSize`).set(snapshot.val() + 1);
      });
  };

  createSearchTags = (packId, hymnId, hymn) => {
    const { db } = this.props;
    db.ref(`searchRedundancy/${hymnId}/`).set(hymn);
    const { title, hymnPage, hymnNumber, hymnal } = this.state;
    const tags = title.split(" ");
    tags.push(hymnPage, hymnNumber);
    const alltags = tags.concat(hymnal.split(" "));
    alltags.forEach(function (item) {
      // eslint-disable-next-line
      const regexp = /[{}\d(),\/"':;.#$\[\]]/g;
      const tag = item
        .replace(regexp, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (tag !== "" && tag !== "Hymnal") {
        db.ref(`searchRedundancy/${hymnId}/${tag.toLowerCase()}`).set(true);
      }
    });
    db.ref(`searchRedundancy/${hymnId}/packId`).set(packId);
  };

  getPacks = (snapshot) => {
    this.setState({ loading: true });
    const hymnPacks = [];
    snapshot.forEach(function (childSnapshot) {
      hymnPacks.push({
        packId: childSnapshot.key,
        packName: childSnapshot.val().packName,
        packSize: childSnapshot.val().packSize,
      });
    });
    this.setState({ hymnPacks });
    this.setState({ loading: false });
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

  render() {
    return (
      <div>
        {this.renderEmptyTitleAlert()}
        <form>
          <div className="form-group">
            <label htmlFor="hymnTitle">Title</label>
            <input
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
              className="form-control"
              id="hymnTitle"
            />
          </div>
          <div className="form-group">
            <label htmlFor="hymnNumber">Hymn number</label>
            <input
              type="number"
              name="hymnNumber"
              value={this.state.hymnNumber}
              onChange={this.handleChange}
              className="form-control"
              id="hymnNumber"
            />
          </div>
          <div className="form-group">
            <label htmlFor="hymnPage">Hymn page</label>
            <input
              type="number"
              name="hymnPage"
              value={this.state.hymnPage}
              onChange={this.handleChange}
              className="form-control"
              id="hymnPage"
            />
          </div>

          <div className="form-group">
            <label htmlFor="exampleFormControlSelect1">Hymnal</label>
            <select
              className="form-control"
              value={this.state.hymnal}
              onChange={this.handleChange}
              name="hymnal"
              id="exampleFormControlSelect1"
            >
              <option>CDH</option>
              <option>Blue Hymnal</option>
              <option>Unreferenced</option>
            </select>
          </div>
          <br />
          {this.showHideLoader()}
          <ul className="list-group">
            {this.state.hymnPacks.map((hymnPack) => (
              <li
                key={hymnPack.packId}
                onClick={() => this.createHymn(hymnPack.packId)}
                className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
              >
                {hymnPack.packName}
                <span className="badge badge-pill m-2 badge-primary">
                  {hymnPack.packSize}
                </span>
              </li>
            ))}
          </ul>
        </form>
      </div>
    );
  }
}

export default AddHymn;
