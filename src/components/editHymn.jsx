import React from "react";
const EditHymn = (props) => {
  const fadedSaveBtn = (
    <button
      type="button"
      className="btn btn-primary"
      data-dismiss="modal"
      disabled
    >
      Save
    </button>
  );
  const enabledSaveBtn = (
    <button
      type="button"
      className="btn btn-primary"
      data-dismiss="modal"
      onClick={props.updateHymn}
    >
      Save
    </button>
  );

  let hymnPacks = (
    <React.Fragment>
      <ul className="list-group">
        {props.hymnPacks.map((hymnPack) => (
          <li
            key={hymnPack.packId}
            onClick={() => props.doChangeHymnPack(hymnPack.packId)}
            data-dismiss="modal"
            className={
              "list-group-item d-flex justify-content-between align-items-center list-group-item-action " +
              (hymnPack.packId === props.packId && "bg-secondary text-white")
            }
          >
            {hymnPack.packName}
            <span className="badge badge-pill m-2 badge-primary">
              {hymnPack.packSize}
            </span>
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <div className="modal-body">
        <form>
          <div className="form-group">
            <label htmlFor="hymnTitle">Title</label>
            {props.title === "" && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                Title should not be empty! If you click save no changes will
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
            <input
              type="text"
              name="title"
              value={props.title}
              onChange={props.handleChange}
              className="form-control"
              id="hymnTitle"
            />
          </div>
          <div className="form-group">
            <label htmlFor="hymnNumber">Hymn number</label>
            <input
              type="number"
              name="hymnNumber"
              value={props.hymnNumber}
              onChange={props.handleChange}
              className="form-control"
              id="hymnNumber"
            />
          </div>
          <div className="form-group">
            <label htmlFor="hymnPage">Hymn page</label>
            <input
              type="number"
              name="hymnPage"
              value={props.hymnPage}
              onChange={props.handleChange}
              className="form-control"
              id="hymnPage"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlSelect1">Hymnal</label>
            <select
              className="form-control"
              value={props.hymnal}
              onChange={props.handleChange}
              name="hymnal"
              id="exampleFormControlSelect1"
            >
              <option>CDH</option>
              <option>Blue Hymnal</option>
              <option>Unreferenced</option>
            </select>
          </div>
          <div className="form-group form-check">
            <input
              type="checkbox"
              name="changeHymnPack"
              onChange={props.handleChange}
              className="form-check-input"
              checked={props.changeHymnPack}
              id="changeHymnPack"
            />
            <label className="form-check-label" htmlFor="changeHymnPack">
              Change hymn pack
            </label>
          </div>
        </form>
        {props.changeHymnPack ? hymnPacks : ""}
      </div>
      <div className="modal-footer">
        {props.changeHymnPack ? fadedSaveBtn : enabledSaveBtn}
        <button type="button" className="btn btn-danger" data-dismiss="modal">
          Cancel
        </button>
      </div>
    </React.Fragment>
  );
};

export default EditHymn;
