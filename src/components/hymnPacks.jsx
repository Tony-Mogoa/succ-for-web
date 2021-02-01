import React, { Component } from "react";
import HymnPack from "./hymnPack";
import { Link } from "react-router-dom";
import SearchBar from "./searchBar";
import HymnInList from "./hymnInList";
import moment from "moment";
import OptionMenu from "./modalOptionMenu";
import EditHymn from "./editHymn";
import MassModal from "./hymnsMassModal";

class HymnPacks extends Component {
  state = {
    hymnPacks: [],
    loading: true,
    theme: "normal",
    keywords: "",
    searchedForHymns: [],
    rawSearchResults: new Map(),
    selectHymn: {},
    whichModal: "",
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
    noResult: "",
  };

  getTheme = (snapshot) => {
    this.setState({ theme: snapshot.val() });
  };

  componentDidMount() {
    this.checkIfOnBoardIsComplete();
    this.props.setNavTitle("Sing");
    this.props.db.ref("hymn_packs").on("value", this.getPacks);
    this.props.db.ref("theme").on("value", this.getTheme);
  }

  handleSearchClick = (event) =>{
    const{keywords} = this.state;
    this.props.db.ref("searchRedundancy").off();
    if(keywords === ""){
      this.setState({ loading: false });
    }
    else{
      this.setState({ loading: true, searchedForHymns: [] });
    }
    // keywords === ""
    //   ? this.setState({ loading: false })
    //   : this.setState({ loading: true });
    this.setState({
      rawSearchResults: new Map(),
    });
    this.explodeKeywords(keywords);
  }

  handleSearchBarChange = (event) => {
    const input = event.target;
    this.props.db.ref("searchRedundancy").off();
    this.setState({noResult: <div className="alert alert-secondary" role="alert">
    Click <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
        <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
      </svg> to start searching
  </div>});
    if(input.value === ""){
      this.setState({ loading: false });
    }
    else{
      this.setState({searchedForHymns: [] });
    }
    // input.value === ""
    //   ? this.setState({ loading: false })
    //   : this.setState({ loading: true });
    this.setState({
      keywords: input.value
    });
    //this.explodeKeywords(input.value);
  };

  explodeKeywords = (keywords) => {
    var searchKeywords = [];
    const wordsFromWhiteSpace = keywords.split(" ");
    wordsFromWhiteSpace.forEach(function (item) {
      // eslint-disable-next-line
      const regexp = /[.#$\[\]]/g;
      if (item !== "") {
        searchKeywords.push(item.replace(regexp, ""));
      }
    });
    searchKeywords.forEach(this.queryResultByKeyword);
  };

  queryResultByKeyword = (item, index, array) => {
    this.props.db
      .ref("searchRedundancy")
      .orderByChild(item.toLowerCase())
      .equalTo(true)
      .on(
        "value",
        function (snapshot) {
          // console.log(snapshot.child(item).key);  
          if(snapshot.numChildren() > 0 ){
              this.setState({loading: true});
          }
          else{
              this.setState({loading: false, noResult: <div className="alert alert-secondary" role="alert">
              No results
            </div>});
          }
          const { rawSearchResults } = this.state;
          let childCount = 0;
          const updatedRawSearchResults = new Map([...rawSearchResults.entries(),]);
          snapshot.forEach(
            function (childSnapshot) {
              childCount++;
              const hymn = {
                id: childSnapshot.key,
                details: childSnapshot.val(),
              };

              if (updatedRawSearchResults.has(hymn.id)) {
                const count = updatedRawSearchResults.get(hymn.id);
                const newCount = count[0] + 1;
                updatedRawSearchResults.set(hymn.id, [newCount, hymn]);
              } else {
                updatedRawSearchResults.set(hymn.id, [0, hymn]);
              }
              this.setState({ rawSearchResults: updatedRawSearchResults });
              if (
                childCount === snapshot.numChildren() &&
                snapshot.child(item).key === array[array.length - 1]
              ) {
                this.sortResults();
                this.setState({loading: false});
                if(this.state.searchedForHymns.length === 0){
                  this.setState({noResult: ""});
                }
              }
            }.bind(this)
          );
        }.bind(this)
      );
  };

  sortResults = () => {
    this.setState({ searchedForHymns: [] });
    const sortedResults = new Map(
      [...this.state.rawSearchResults.entries()].sort(
        (a, b) => a[1][0] - b[1][0]
      )
    );
    const hymnsFromSearch = [];
    for (const [, value] of sortedResults) {
      hymnsFromSearch.push({
        hymnId: value[1].id,
        hymnNumber: value[1].details.hymnNumber,
        hymnPage: value[1].details.hymnPage,
        hymnal: value[1].details.hymnal,
        title: value[1].details.title,
        packId: value[1].details.packId,
      });
    }
    this.setState({
      searchedForHymns: hymnsFromSearch.reverse(),
      loading: false,
    });
  };

  componentWillUnmount() {
    this.props.db.ref("theme").off("value", this.getTheme);
    this.props.db.ref("hymn_packs").off("value", this.getPacks);
  }

  // handle scroll position after content load
  handleScrollPosition = () => {
    const scrollPosition = sessionStorage.getItem("scrollPositionForHymnPacks");
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
      sessionStorage.removeItem("scrollPositionForHymnPacks");
    }
  };

  // store position in sessionStorage
  handleClick = (e) => {
    sessionStorage.setItem("scrollPositionForHymnPacks", window.pageYOffset);
  };

  renderSearchResultsOrPacks = () => {
    if (this.state.keywords !== "") {
      if(this.state.searchedForHymns.length  === 0 && this.state.loading === false){
        return this.state.noResult;
      }
      else{
        return (this.state.searchedForHymns.map((hymnInList) => (
            <li
              className="list-group-item list-group-item-action"
              key={hymnInList.hymnId}
            >
              <HymnInList
                hymnInList={hymnInList}
                onSetHymn={this.handleSetHymn}
                to={`/hymn/${hymnInList.title}/${hymnInList.hymnId}`}
                badgeThemeProp={this.supplyTheme()}
              />
            </li>
          )));
      }
      
    } else {
      return this.state.hymnPacks.map((hymnPack) => (
        <Link
          className="list-group-item d-flex justify-content-between align-items-center list-group-item-action "
          key={hymnPack.packId}
          onClick={this.handleClick}
          to={`/hymns/${hymnPack.packName}/${hymnPack.packId}`}
        >
          <HymnPack hymnPack={hymnPack} badgeThemeProp={this.supplyTheme()} />
        </Link>
      ));
    }
  };

  checkIfOnBoardIsComplete = () => {
    if (!localStorage.getItem("onBoardComplete")) {
      this.props.history.push(`/`);
    }
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
    this.setState({ hymnPacks });
    this.setState({ loading: false });
    this.handleScrollPosition();
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

  // ######################## HYMN OPTIONS ###################################### //
  handleSetModal = (whichModal) => {
    const { selectHymn } = this.state;
    this.setState({ whichModal });
    if (whichModal === "Hymns for Mass") {
      this.setState({ modalStyle: "" });
    } else {
      this.setState({
        title: selectHymn.title,
        hymnPage: selectHymn.hymnPage,
        hymnNumber: selectHymn.hymnNumber,
        hymnal: selectHymn.hymnal,
        modalStyle: "modal-dialog-scrollable",
      });
    }
  };

  handleDeleteHymn = () => {
    const { db } = this.props;
    const { selectHymn } = this.state;
    db.ref(`packsAndTitles/${selectHymn.packId}/${selectHymn.hymnId}`).remove(
      this.handleHymnDelFeedback
    );
    db.ref(`searchRedundancy/${selectHymn.hymnId}`).remove();
    db.ref(`titlesAndVerses/${selectHymn.hymnId}`).remove();
    this.decrementPackSize();
    const searchedForHymns = this.state.searchedForHymns.filter(
      (c) => c.hymnId !== selectHymn.hymnId
    );
    this.setState({ searchedForHymns });
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
    const { db } = this.props;
    const {
      selectHymn: { packId },
    } = this.state;
    db.ref(`hymn_packs/${packId}/packSize`)
      .once("value")
      .then(function (snapshot) {
        db.ref(`hymn_packs/${packId}/packSize`).set(snapshot.val() - 1);
      });
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

  deleteSearchTags = (hymnId, hymn) => {
    const { db } = this.props;
    //db.ref(`searchRedundancy/${hymnId}/`).set(hymn);
    const { title, hymnPage, hymnNumber, hymnal } = hymn;
    const tags = title.split(" ");
    tags.push(hymnPage, hymnNumber);
    const alltags = tags.concat(hymnal.split(" "));
    alltags.forEach(function (item) {
      // eslint-disable-next-line
      const regexp = /[{}()\d,\/"':;.#$\[\]]/g;
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
    Object.keys(hymn).map((key) =>
      db.ref(`searchRedundancy/${hymnId}/${key}`).set(hymn[key])
    );
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
        db.ref(`searchRedundancy/${hymnId}/${tag.toLowerCase()}`).set(true);
      }
    });
    //db.ref(`searchRedundancy/${hymnId}/packId`).set(packId);
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
    const { db } = this.props;
    const { title, hymnPage, hymnNumber, hymnal, selectHymn } = this.state;
    if (title !== "") {
      const newHymn = {
        title: title,
        hymnPage: hymnPage,
        hymnNumber: hymnNumber,
        hymnal: hymnal,
        packId: selectHymn.packId,
      };
      db.ref(`packsAndTitles/${selectHymn.packId}/${selectHymn.hymnId}`).set(
        newHymn
      );
      this.deleteSearchTags(selectHymn.hymnId, selectHymn);
      this.createSearchTags(selectHymn.hymnId, newHymn);
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
    const { db } = this.props;
    if (title !== "") {
      db.ref(
        `packsAndTitles/${selectHymn.packId}/${selectHymn.hymnId}`
      ).remove();
      db.ref(`packsAndTitles/${newPackId}/${selectHymn.hymnId}`).set(newHymn);
      this.decrementPackSizeOfOldPack(selectHymn.packId);
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

  renderWhichModal = () => {
    const {
      date,
      hymnType,
      showWhichComponent,
      focused,
      hymnPacks,
      selectHymn: { packId },
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
            packId={packId}
            handleChange={this.handleChange}
            updateHymn={this.updateHymn}
            doChangeHymnPack={this.doChangeHymnPack}
          />
        );
      default:
        break;
    }
  };
  // ######################## HYMN OPTIONS ###################################### //
  render() {
    return (
      <div>
        <OptionMenu
          onSetModal={this.handleSetModal}
          selectHymn={this.state.selectHymn}
          onDeleteHymn={this.handleDeleteHymn}
          onAlterVerses={this.toAddVerses}
          onAddToFavs={this.handleAddToFavs}
        />
        <SearchBar
          keywords={this.state.keywords}
          onHandleChange={this.handleSearchBarChange}
          onHandleClick={this.handleSearchClick}
          themeProp={this.supplyThemeForSearchButton()}
        />
        {this.showHideLoader()}
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

        <ul className="list-group">{this.renderSearchResultsOrPacks()}</ul>
      </div>
    );
  }

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

supplyThemeForSearchButton = () => {
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
}

export default HymnPacks;
