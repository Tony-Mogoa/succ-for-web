import React, { Component } from "react";
import EditVerse from "./editVerse";
import Verse from "./verse";
import AudioBar from "./audioBar";
import ReactTooltip from "react-tooltip";
import { Document, Page, pdfjs } from "react-pdf";

class HymnView extends Component {
  state = {
    verseList: [],
    loading: true,
    pdfLink: "",
    theme: "normal",
    verse: {},
    isChorus: false,
    verseText: "",
    audios: {},
    showAudioBar: false,
    audioTrack: "",
    numPages: null,
    pageNumber: 1,
    hasMusicScore: false,
    showScore: false,
  };

  getTheme = (snapshot) => {
    this.setState({ theme: snapshot.val() });
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

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

  componentDidMount() {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    this.checkIfOnBoardIsComplete();
    const {
      match: { params },
      db,
    } = this.props;
    this.props.setNavTitle(params.title);
    db.ref("theme").on("value", this.getTheme);
    db.ref(`titlesAndVerses/${params.hymnId}`).on("value", this.getHymnVerses);
    db.ref(`audios/${params.hymnId}`).on("value", this.getAudioData);
    db.ref(`musicScores/${params.hymnId}`).on("value", this.checkHasMusicScore);
  }

  getAudioData = (snapshot) => {
    const audios = {
      s: snapshot.val().soprano,
      a: snapshot.val().alto,
      t: snapshot.val().tenor,
      b: snapshot.val().bass,
      c: snapshot.val().choir,
    };
    this.setState({ audios });
  };

  checkHasMusicScore = (snapshot) => {
    const {
      storage,
      match: { params },
    } = this.props;
    if (snapshot.val().hasMusicScore) {
      storage
        .ref(`musicScores/${params.hymnId}`)
        .getDownloadURL()
        .then(
          function (url) {
            this.setState({ pdfLink: url, hasMusicScore: true });
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  checkIfOnBoardIsComplete = () => {
    if (!localStorage.getItem("onBoardComplete")) {
      this.props.history.push(`/`);
    }
  };

  componentWillUnmount() {
    const {
      match: { params },
      db,
    } = this.props;
    db.ref(`titlesAndVerses/${params.hymnId}`).off("value", this.getHymnVerses);
    db.ref("theme").off("value", this.getTheme);
    db.ref(`audios/${params.hymnId}`).off("value", this.getAudioData);
    db.ref(`musicScores/${params.hymnId}`).off(
      "value",
      this.checkHasMusicScore
    );
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

  formatChorus(isChrous) {
    if (isChrous) {
      return "text-primary";
    } else {
      return "text-secondary";
    }
  }

  renderEditVerseModal = () => {
    const { verseText, isChorus } = this.state;
    return (
      <EditVerse
        handleChange={this.handleChange}
        isChorus={isChorus}
        updateVerse={this.updateVerse}
        verseText={verseText}
      />
    );
  };

  updateVerse = () => {
    const {
      match: { params },
      db,
    } = this.props;
    const { verseText, isChorus, verse } = this.state;
    if (verseText !== "") {
      const newVerse = {
        verseText: this.cleanVerse(verseText),
        chorus: isChorus,
      };
      db.ref(`titlesAndVerses/${params.hymnId}/${verse.verseId}`).set(newVerse);
      this.deleteVerseSearchTags();
      this.createVerseSearchTags();
    }
  };

  cleanVerse = (str) => {
    return this.removeTabSpace(str).trim();
  };

  removeTabSpace(str) {
    return str.replace(/\t/g, " ");
  }

  handleChange = (event) => {
    const input = event.target;
    const value = input.type === "checkbox" ? input.checked : input.value;
    this.setState({ [input.name]: value });
  };

  createVerseSearchTags = () => {
    const {
      match: { params },
      db,
    } = this.props;
    // eslint-disable-next-line
    const regexp = /[{}\d(),\/"':;.#$\[\]\n]/g;
    const verseTextWithoutNewline = this.cleanVerse(this.state.verseText)
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

  deleteVerseSearchTags = () => {
    const {
      db,
      match: { params },
    } = this.props;

    // eslint-disable-next-line
    const regexp = /[{}\d.#$\[\]\n]/g;
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

  renderModal = (verse) => {
    this.setState({
      verse,
      verseText: verse.verseText,
      isChorus: verse.isChorus,
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

  renderAudioButton = () => {
    let buttonTheme = "btn btn-small float-right " + this.supplyTheme();
    // eslint-disable-next-line
    return localStorage.getItem("userType") == 2 ||
      // eslint-disable-next-line
      localStorage.getItem("userType") == 3 ? (
      <React.Fragment>
        <button
          className={buttonTheme}
          data-tip="Press again to toggle showing of the audio bar."
          onClick={this.showAudioBar}
        >
          Audios
        </button>
        
      </React.Fragment>
    ) : null;
  };

  renderMusicScoreButton = () =>{
    if(this.state.hasMusicScore){
      let buttonTheme = "btn btn-small float-right ml-2 " + this.supplyTheme();
      return <button className={buttonTheme} data-tip="Press again to toggle showing of the audio bar." onClick={this.setShowScore}>
        Music score
        </button>;
    }
  }

  setShowScore = () =>{
    this.state.showScore ? this.setState({ showScore: false })
    : this.setState({ showScore: true });
  }

  showAudioBar = () => {
    this.state.showAudioBar
      ? this.setState({ showAudioBar: false })
      : this.setState({ showAudioBar: true });
  };

  playAudio = (voice) => {
    const {
      storage,
      match: { params },
    } = this.props;
    this.setState({ loading: true });
    storage
      .ref(`audios/${params.hymnId + this.getVoiceLongName(voice)}`)
      .getDownloadURL()
      .then(
        function (url) {
          this.setState({ audioTrack: url, loading: false });
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
      });
  };

  getVoiceLongName(voiceShort) {
    switch (voiceShort) {
      case "s":
        return "soprano";
      case "a":
        return "alto";
      case "t":
        return "tenor";
      case "b":
        return "bass";
      default:
        return "choir";
    }
  }

  renderMusicScore = () => {
    const { numPages, hasMusicScore, pdfLink, showScore } = this.state;
    if (hasMusicScore && pdfLink !== "" && showScore === true) {
      return (
        <React.Fragment>
          <small>Musical Score</small>
          <Document
            file={pdfLink}
            onLoadError={console.error}
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
          <br />
        </React.Fragment>
      );
    }
  };
  render() {
    const { audios, showAudioBar, audioTrack } = this.state;
    return (
      <React.Fragment>
        <div>
          <br />
          <div>
          {this.renderMusicScoreButton()}
          {this.renderAudioButton()}
          </div>
          <br/>
          <br/>
          {this.showHideLoader()}
          {this.renderEditVerseModal()}
          <ReactTooltip />
          {this.renderMusicScore()}
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
        </div>
        <AudioBar
          audios={audios}
          btnTheme={this.supplyTheme()}
          showAudioBar={showAudioBar}
          playAudio={this.playAudio}
          audioTrack={audioTrack}
        />
      </React.Fragment>
    );
  }
}

export default HymnView;
