import React, { Component } from "react";
import HymnInList from "./hymnInList";
import OptionMenu from "./modalOptionMenu";
import EditHymn from "./editHymn";
import MassModal from "./hymnsMassModal";
import moment from "moment";

class HymnList extends Component {
  state = {
    hymnList: [],
    theme: "normal",
    loading: true,
    selectHymn: {},
    whichModal: "",
    message: "",
    successful: false,
    showToast: false,
    modalStyle: "modal-dialog-scrollable",
    date: moment(),
    focused: null,
    hymnType: "Entrance",
    showWhichComponent: "date",
    changeHymnPack: false,
    title: "",
    hymnNumber: "",
    hymnPage: "",
    hymnal: "",
    hymnPacks: [],
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
    this.handleScrollPosition();
  };

  checkIfOnBoardIsComplete = () => {
    if (!localStorage.getItem("onBoardComplete")) {
      this.props.history.push(`/`);
    }
  };

  componentDidMount() {
    this.checkIfOnBoardIsComplete();
    const {
      match: { params },
      db,
    } = this.props;
    this.props.setNavTitle(params.packName);
    db.ref(`packsAndTitles/${params.packId}`)
      .orderByChild("title")
      .on("value", this.getHymnList);
    db.ref("theme").on("value", this.getTheme);
  }

  componentWillUnmount() {
    const {
      match: { params },
    } = this.props;
    this.props.db
      .ref(`packsAndTitles/${params.packId}`)
      .off("value", this.getHymnList);
    this.props.db.ref("theme").off("value", this.getTheme);
  }

  // handle scroll position after content load
  handleScrollPosition = () => {
    const scrollPosition = sessionStorage.getItem("scrollPositionForHymnList");
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
      sessionStorage.removeItem("scrollPositionForHymnList");
    }
  };

  // store position in sessionStorage
  handleClick = (e) => {
    sessionStorage.setItem("scrollPositionForHymnList", window.pageYOffset);
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

  // EditHymn ###########################################################################
  deleteSearchTags = (hymnId, hymn) => {
    const { db } = this.props;
    //db.ref(`searchRedundancy/${hymnId}/`).set(hymn);
    const { title, hymnPage, hymnNumber, hymnal } = hymn;
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
        db.ref(`searchRedundancy/${hymnId}/${tag.toLowerCase()}`).remove();
      }
    });
    //db.ref(`searchRedundancy/${hymnId}/packId`).set(packId);
  };

  createSearchTags = (hymnId, hymn) => {
    const { db } = this.props;
    const { title, hymnPage, hymnNumber, hymnal } = hymn;

    Object.keys(hymn).map((key) =>
      db.ref(`searchRedundancy/${hymnId}/${key}`).set(hymn[key])
    );

    const tags = title.split(" ");
    tags.push(hymnPage, hymnNumber);
    const alltags = tags.concat(hymnal.split(" "));
    alltags.forEach(function (item) {
      // eslint-disable-next-line
      const regexp = /[{}(),\/"':;.#$\[\]]/g;
      const tag = item
        .replace(regexp, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (tag !== "" && tag !== "Hymnal") {
        db.ref(`searchRedundancy/${hymnId}/${tag.toLowerCase()}`).set(true);
      }
    });
    //db.ref(`searchRedundancy/${hymnId}/packId`).set(packId);
  };

  getPacks = (snapshot) => {
    const hymnPacks = [];
    snapshot.forEach(function (childSnapshot) {
      hymnPacks.push({
        packId: childSnapshot.key,
        packName: childSnapshot.val().packName,
        packSize: childSnapshot.val().packSize,
      });
    });
    this.setState({ hymnPacks, loading: false });
  };

  handleChange = (event) => {
    const input = event.target;
    let value;
    switch (input.name) {
      case "changeHymnPack":
        value = input.checked;
        break;
      case "title":
        value = this.capitalizeEachWord(input.value);
        break;
      default:
        value = input.value;
        break;
    }
    this.setState({ [input.name]: value });
  };

  capitalizeEachWord(phrase) {
    return phrase.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  updateHymn = () => {
    const {
      db,
      match: { params },
    } = this.props;
    const { title, hymnPage, hymnNumber, hymnal, selectHymn } = this.state;
    if (title !== "") {
      const newHymn = {
        title: title,
        hymnPage: hymnPage,
        hymnNumber: hymnNumber,
        hymnal: hymnal,
      };
      db.ref(`packsAndTitles/${params.packId}/${selectHymn.hymnId}`).set(
        newHymn
      );
      this.deleteSearchTags(selectHymn.hymnId, selectHymn);
      this.createSearchTags(selectHymn.hymnId, newHymn);
      db.ref("hymn_packs").off("value", this.getPacks);
    }
  };

  doChangeHymnPack = (newPackId) => {
    const { title, hymnPage, hymnNumber, hymnal, selectHymn } = this.state;
    const newHymn = {
      title: title,
      hymnPage: hymnPage,
      hymnNumber: hymnNumber,
      hymnal: hymnal,
    };
    const {
      db,
      match: { params },
    } = this.props;
    if (title !== "") {
      db.ref(`packsAndTitles/${params.packId}/${selectHymn.hymnId}`).remove();
      db.ref(`packsAndTitles/${newPackId}/${selectHymn.hymnId}`).set(newHymn);
      this.decrementPackSizeOfOldPack(params.packId);
      this.incrementPackSizeOfNewPack(newPackId);
      db.ref(`searchRedundancy/${selectHymn.hymnId}/packId`).set(newPackId);
      db.ref("hymn_packs").off("value", this.getPacks);
    }
  };

  incrementPackSizeOfNewPack = (packId) => {
    const { db } = this.props;
    db.ref(`hymn_packs/${packId}/packSize`)
      .once("value")
      .then(function (snapshot) {
        db.ref(`hymn_packs/${packId}/packSize`).set(snapshot.val() + 1);
      });
  };

  decrementPackSizeOfOldPack = (packId) => {
    const { db } = this.props;
    db.ref(`hymn_packs/${packId}/packSize`)
      .once("value")
      .then(function (snapshot) {
        db.ref(`hymn_packs/${packId}/packSize`).set(snapshot.val() - 1);
      });
  };
  //##############################################################################
  //^Edit Hymn
  handleDeleteHymn = () => {
    const {
      match: { params },
      db,
    } = this.props;
    const { selectHymn } = this.state;
    db.ref(`packsAndTitles/${params.packId}/${selectHymn.hymnId}`).remove();
    db.ref(`searchRedundancy/${selectHymn.hymnId}`).remove();
    db.ref(`titlesAndVerses/${selectHymn.hymnId}`).remove(
      this.handleHymnDelFeedback
    );
    this.decrementPackSize();
  };

  handleSetDate = (date) => {
    this.setState({ date });
  };

  handleSetFocus = (focused) => {
    this.setState({ focused });
  };

  handleMassHymnSave = () => {
    const { db } = this.props;
    const { date, selectHymn, hymnType } = this.state;
    const MassHymn = {
      title: selectHymn.title,
      hymnPage: selectHymn.hymnPage,
      hymnNumber: selectHymn.hymnNumber,
      hymnal: selectHymn.hymnal,
      type: hymnType,
      index: this.returnHymnTypeIndex(hymnType),
    };
    db.ref(`MassHymns/${date.format("MMM D, YYYY")}/${selectHymn.hymnId}`).set(
      MassHymn,
      this.handleDbFeedback
    );
  };

  returnHymnTypeIndex(hymnType) {
    switch (hymnType) {
      case "Entrance":
        return 0;
      case "Kyrie and Gloria":
        return 1;
      case "Gospel Procession":
        return 2;
      case "Offertory":
        return 3;
      case "Communion":
        return 4;
      case "Exit":
        return 5;
      default:
        return 0;
    }
  }

  handleDbFeedback = (error) => {
    if (error) {
      // The write failed...
      const message = "Setting hymn for Mass failed.";
      this.handleFeedback(error, message);
    } else {
      const { hymnType, selectHymn, date } = this.state;
      const message = `${hymnType}: ${
        selectHymn.title
      } for Mass on ${date.format("MMM D, YYYY")}`;
      this.handleFeedback(error, message);
    }
  };

  handleNextButtonPress = () => {
    this.setState({ showWhichComponent: "hymnType" });
  };

  handleHymnDelFeedback = (error) => {
    const { selectHymn } = this.state;
    if (error) {
      // The write failed...
      const message = `${selectHymn.title} not deleted!`;
      this.handleFeedback(error, message);
    } else {
      const message = `${selectHymn.title} deleted!`;
      this.handleFeedback(error, message);
    }
  };

  decrementPackSize = () => {
    const {
      match: { params },
      db,
    } = this.props;
    db.ref(`hymn_packs/${params.packId}/packSize`)
      .once("value")
      .then(function (snapshot) {
        db.ref(`hymn_packs/${params.packId}/packSize`).set(snapshot.val() - 1);
      });
  };

  handleSetHymn = (selectHymn) => {
    this.setState({ selectHymn });
  };

  handleSetModal = (whichModal) => {
    const { db } = this.props;
    const { selectHymn } = this.state;
    this.setState({ whichModal });
    if (whichModal === "Hymns for Mass") {
      this.setState({ modalStyle: "" });
    } else {
      db.ref("hymn_packs").on("value", this.getPacks);
      this.setState({
        title: selectHymn.title,
        hymnPage: selectHymn.hymnPage,
        hymnNumber: selectHymn.hymnNumber,
        hymnal: selectHymn.hymnal,
        modalStyle: "modal-dialog-scrollable",
      });
    }
  };

  handleFeedback = (error, message) => {
    if (error) {
      // The write failed...
      this.setState({ message });
      this.setState({ showToast: true, successful: false });
      setTimeout(() => this.setState({ showToast: false }), 3000);
    } else {
      this.setState({ message });
      this.setState({ showToast: true, successful: true });
      setTimeout(() => this.setState({ showToast: false }), 3000);
    }
  };

  renderFeedback = () => {
    const { showToast, successful, message } = this.state;
    if (showToast) {
      return successful ? (
        <div className="alert alert-success fixed-bottom" role="alert">
          {message}
        </div>
      ) : (
        <div className="alert alert-danger fixed-bottom" role="alert">
          {message}
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

  renderWhichModal = () => {
    const {
      match: { params },
    } = this.props;
    const {
      date,
      hymnType,
      showWhichComponent,
      focused,
      hymnPacks,
    } = this.state;
    switch (this.state.whichModal) {
      case "Hymns for Mass":
        return (
          <MassModal
            showWhichComponent={showWhichComponent}
            handleNextButtonPress={this.handleNextButtonPress}
            handleMassHymnSave={this.handleMassHymnSave}
            handleChange={this.handleChange}
            setDate={this.handleSetDate}
            setFocus={this.handleSetFocus}
            date={date}
            focused={focused}
            hymnType={hymnType}
          />
        );
      case "Edit Hymn":
        const {
          title,
          hymnPage,
          hymnNumber,
          hymnal,
          changeHymnPack,
        } = this.state;
        return (
          <EditHymn
            hymnPacks={hymnPacks}
            title={title}
            hymnPage={hymnPage}
            hymnNumber={hymnNumber}
            hymnal={hymnal}
            changeHymnPack={changeHymnPack}
            packId={params.packId}
            handleChange={this.handleChange}
            updateHymn={this.updateHymn}
            doChangeHymnPack={this.doChangeHymnPack}
          />
        );
      default:
        break;
    }
  };

  toAddVerses = () => {
    this.props.history.push(`/addVerses/${this.state.selectHymn.hymnId}`);
  };

  handleAddToFavs = () => {
    const { db } = this.props;
    const { selectHymn } = this.state;
    const userId = localStorage.getItem("userId");
    db.ref(`favorites/${userId}/${selectHymn.hymnId}`).set(
      selectHymn,
      function (error) {
        if (error) {
          const message = `Failed to add "${selectHymn.title}" to favourites !`;
          this.handleFeedback(error, message);
        } else {
          const message = `"${selectHymn.title}" added to favourites`;
          this.handleFeedback(error, message);
        }
      }.bind(this)
    );
  };

  render() {
    return (
      <div>
        <br />
        {this.showHideLoader()}
        <OptionMenu
          onSetModal={this.handleSetModal}
          selectHymn={this.state.selectHymn}
          onDeleteHymn={this.handleDeleteHymn}
          onAlterVerses={this.toAddVerses}
          onAddToFavs={this.handleAddToFavs}
        />
        {this.renderFeedback()}
        <div
          className="modal fade"
          id="taskModal"
          data-backdrop="static"
          data-keyboard="false"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div
            className={"modal-dialog " + this.state.modalStyle}
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  {this.state.whichModal}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              {this.renderWhichModal()}
              {/* modal body and footer */}
            </div>
          </div>
        </div>

        <ul className="list-group">
          {this.state.hymnList.map((hymnInList) => (
            <li
              className="list-group-item list-group-item-action"
              key={hymnInList.hymnId}
              onClick={this.handleClick}
            >
              <HymnInList
                hymnInList={hymnInList}
                onSetHymn={this.handleSetHymn}
                to={`/hymn/${hymnInList.title}/${hymnInList.hymnId}`}
                badgeThemeProp={this.supplyTheme()}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default HymnList;
