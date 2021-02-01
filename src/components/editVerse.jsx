import React from "react";
const EditVerse = (props) => {
  return (
    <div
      className="modal fade"
      id="editVerse"
      data-backdrop="static"
      data-keyboard="false"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              Edit Verse
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
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label htmlFor="verseText">Enter verse</label>
                {props.verseText === "" && (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    Verse should not be empty! If you click save no changes will
                    happen.
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                )}
                <textarea
                  className="form-control"
                  id="verseText"
                  rows="3"
                  placeholder="Verse text"
                  name="verseText"
                  value={props.verseText}
                  onChange={props.handleChange}
                  required
                ></textarea>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    name="isChorus"
                    type="checkbox"
                    id="isChorus"
                    onChange={props.handleChange}
                    checked={props.isChorus}
                  />
                  <label className="form-check-label" htmlFor="isChorus">
                    is chorus
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-dismiss="modal"
              onClick={props.updateVerse}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVerse;
