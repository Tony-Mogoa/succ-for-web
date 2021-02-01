import React from "react";
const Verse = (props) => {
  let options;
  // eslint-disable-next-line
  if (props.showOptions && localStorage.getItem("userType") == 3) {
    options = (
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#editVerse"
        >
          Edit verse
        </button>
        <button
          type="button"
          className="close"
          onClick={props.closeOptions}
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <button className="btn btn-danger" onClick={props.onDeleteVerse}>
          Delete verse
        </button>
      </div>
    );
  }
  return (
    <React.Fragment>
      <div onClick={() => props.renderEditModal(props.verse)}>
        <p className="show-white-space">{props.verse.verseText}</p>
      </div>
      {options}
    </React.Fragment>
  );
};

export default Verse;
