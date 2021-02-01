import React, { Component } from "react";
import EditVerse from "./editVerse";
import Verse from "./verse";

class AddVerses extends Component {
  state = {
    verseText: "",
    isChorus: false,
    verseList: [],
    loading: true,
    verse: {},
    isChorusEdit: false,
    verseTextEdit: "",
  };

  componentDidMount() {
    this.props.setNavTitle("Add Verses");
    const {
      match: { params },
      db,
    } = this.props;
    db.ref(`titlesAndVerses/${params.hymnId}`).on("value", this.getHymnVerses);
  }

  componentWillUnmount() {
    const {
      match: { params },
      db,
    } = this.props;
    db.ref(`titlesAndVerses/${params.hymnId}`).off("value", this.getHymnVerses);
  }

  formatChorus(isChrous) {
    if (isChrous) {
      return "text-primary";
    } else {
      return "text-secondary";
    }
  }

  getHymnVerses = (snapshot) => {
    const verseList = [];
    snapshot.forEach(function (childSnapshot) {
      verseList.push({
        verseId: childSnapshot.key,
        verseText: childSnapshot.val().verseText,
        isChorus: childSnapshot.val().chorus,
      });
    });
    this.setState({ verseList });
    this.setState({ loading: false });
  };

  handleChange = (event) => {
    const input = event.target;
    const value = input.type === "checkbox" ? input.checked : input.value;
    this.setState({ [input.name]: value });
  };

  cleanVerse = (str) => {
    return this.removeTabSpace(str).trim();
  };

  removeTabSpace(str) {
    return str.replace(/\t/g, " ");
  }

  handleChangeWhenEditing = (event) => {
    const input = event.target;
    const value = input.type === "checkbox" ? input.checked : input.value;
    this.setState({ [input.name + "Edit"]: value });
  };

  handleSubmit = (event) => {
    const input = event.target;
    event.preventDefault();
    const verse = {
      verseText: this.cleanVerse(this.state.verseText),
      chorus: this.state.isChorus,
    };
    this.setState({ verseText: this.cleanVerse(input.verseText.value) });
    this.addVerse(verse);
    this.createVerseSearchTags(verse.verseText);
    this.clearForm();
  };

  addVerse = (verse) => {
    const {
      match: { params },
      db,
    } = this.props;
    const verseId = db.ref(`titlesAndVerses/${params.hymnId}`).push().key;
    db.ref(`titlesAndVerses/${params.hymnId}/${verseId}`).set(verse);
  };

  createVerseSearchTags = (verseText) => {
    const {
      match: { params },
      db,
    } = this.props;
    // eslint-disable-next-line
    const regexp = /[{}\d(),\/"':;.#$\[\]\n]/g;
    const verseTextWithoutNewline = verseText
      .replace(regexp, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const tags = verseTextWithoutNewline.split(" ");
    tags.forEach(function (item) {
      if (item !== "") {
        db.ref(`searchRedundancy/${params.hymnId}/${item.toLowerCase()}`).set(
          true
        );
      }
    });
  };

  clearForm = () => {
    this.setState({
      verseText: "",
      isChorus: false,
    });
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

  renderModal = (verse) => {
    this.setState({
      verse,
      verseTextEdit: verse.verseText,
      isChorusEdit: verse.isChorus,
    });
  };

  deleteVerse = () => {
    this.props.db
      .ref(
        `titlesAndVerses/${this.props.match.params.hymnId}/${this.state.verse.verseId}`
      )
      .remove();
  };

  renderOptions = (verseId) => {
    return this.state.verse.verseId === verseId ? true : false;
  };

  closeOptions = () => {
    this.setState({ verse: {} });
  };

  renderEditVerseModal = () => {
    const { verseTextEdit, isChorusEdit } = this.state;
    return (
      <EditVerse
        handleChange={this.handleChangeWhenEditing}
        isChorus={isChorusEdit}
        updateVerse={this.updateVerse}
        verseText={verseTextEdit}
      />
    );
  };

  updateVerse = () => {
    const {
      match: { params },
      db,
    } = this.props;
    const { verseTextEdit, isChorusEdit, verse } = this.state;
    if (verseTextEdit !== "") {
      const newVerse = {
        verseText: this.cleanVerse(verseTextEdit),
        chorus: isChorusEdit,
      };
      db.ref(`titlesAndVerses/${params.hymnId}/${verse.verseId}`).set(newVerse);
      this.deleteVerseSearchTags();
      this.createVerseSearchTags(newVerse.verseText);
    }
  };

  deleteVerseSearchTags = () => {
    const {
      db,
      match: { params },
    } = this.props;

    // eslint-disable-next-line
    const regexp = /[{}\d(),\/"':;.#$\[\]\n]/g;
    const verseTextWithoutNewline = this.cleanVerse(this.state.verse.verseText)
      .replace(regexp, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const tags = verseTextWithoutNewline.split(" ");
    tags.forEach(function (item) {
      if (item !== "") {
        db.ref(
          `searchRedundancy/${params.hymnId}/${item.toLowerCase()}`
        ).remove();
      }
    });
  };

  render() {
    return (
      <div>
        {this.renderEditVerseModal()}
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="verseText">Enter verse</label>
            <textarea
              className="form-control"
              id="verseText"
              rows="3"
              placeholder="Verse text"
              name="verseText"
              value={this.state.verseText}
              onChange={this.handleChange}
              required
            ></textarea>
            <div className="form-check">
              <input
                className="form-check-input"
                name="isChorus"
                type="checkbox"
                id="isChorus"
                onChange={this.handleChange}
                checked={this.state.isChorus}
              />
              <label className="form-check-label" htmlFor="isChorus">
                is chorus
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-small btn-primary mb-2">
            Add
          </button>
        </form>
        {this.showHideLoader()}
        <ul className="list-group">
          {this.state.verseList.map((verse) => (
            <li
              className={
                "list-group-item size-25 " + this.formatChorus(verse.isChorus)
              }
              key={verse.verseId}
            >
              <Verse
                verse={verse}
                renderEditModal={this.renderModal}
                onDeleteVerse={this.deleteVerse}
                showOptions={this.renderOptions(verse.verseId)}
                closeOptions={this.closeOptions}
              />
            </li>
          ))}
        </ul>
        <br />
        <button
          className="btn btn-small btn-success mb-2"
          onClick={this.props.history.goBack}
        >
          Finish
        </button>
      </div>
    );
  }
}

export default AddVerses;
