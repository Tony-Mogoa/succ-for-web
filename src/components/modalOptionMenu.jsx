import React from "react";

const OptionMenu = (props) => {
  let options;

  // eslint-disable-next-line
  if (localStorage.getItem("userType") == 2) {
    options = (
      <React.Fragment>
        <li
          className="list-group-item list-group-item-action"
          data-toggle="modal"
          data-target="#taskModal"
          data-dismiss="modal"
          onClick={() => props.onSetModal("Hymns for Mass")}
        >
          For Mass
        </li>
      </React.Fragment>
    );
  }

  // eslint-disable-next-line
  else if (localStorage.getItem("userType") == 3) {
    options = (
      <React.Fragment>
        <li
          className="list-group-item list-group-item-action"
          data-toggle="modal"
          data-target="#taskModal"
          data-dismiss="modal"
          onClick={() => props.onSetModal("Hymns for Mass")}
        >
          For Mass
        </li>
        <li
          className="list-group-item list-group-item-action"
          data-toggle="modal"
          data-target="#taskModal"
          data-dismiss="modal"
          onClick={() => props.onSetModal("Edit Hymn")}
        >
          Edit hymn
        </li>
        <li
          className="list-group-item list-group-item-action"
          onClick={props.onDeleteHymn}
          data-dismiss="modal"
        >
          Delete hymn
        </li>

        <li
          className="list-group-item list-group-item-action"
          onClick={props.onAlterVerses}
          data-dismiss="modal"
        >
          Alter verses
        </li>
      </React.Fragment>
    );
  }

  return (
    <div
      className="modal fade"
      id="hymnOptions"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-body">
            <ul className="list-group list-group-flush">
              <li
                className="list-group-item list-group-item-action"
                onClick={props.onAddToFavs}
                data-dismiss="modal"
              >
                Add to favourites
              </li>
              {options}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionMenu;
