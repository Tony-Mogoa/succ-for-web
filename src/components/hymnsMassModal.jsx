import React from "react";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

const MassModal = (props) => {
  let shownButton;
  let shownComponent;

  const datePicker = (
    <React.Fragment>
      <small>Choose Date</small>
      <br />
      <SingleDatePicker
        date={props.date} // momentPropTypes.momentObj or null
        onDateChange={(date) => props.setDate(date)} // PropTypes.func.isRequired
        focused={props.focused} // PropTypes.bool
        numberOfMonths={1}
        isOutsideRange={() => false}
        onFocusChange={({ focused }) => props.setFocus(focused)} // PropTypes.func.isRequired
        id="your_unique_id" // PropTypes.string.isRequired,
        displayFormat="MMM D, YYYY"
      />
    </React.Fragment>
  );

  const typeList = (
    <div className="form-group">
      <label htmlFor="hymnType">Select category</label>
      <select
        className="form-control"
        value={props.hymnType}
        onChange={props.handleChange}
        name="hymnType"
        id="hymnType"
      >
        <option>Entrance</option>
        <option>Kyrie and Gloria</option>
        <option>Gospel Procession</option>
        <option>Offertory</option>
        <option>Communion</option>
        <option>Exit</option>
      </select>
    </div>
  );
  props.showWhichComponent === "hymnType"
    ? (shownComponent = typeList)
    : (shownComponent = datePicker);
  props.showWhichComponent === "hymnType"
    ? (shownButton = (
        <button
          type="button"
          className="btn btn-success"
          onClick={props.handleMassHymnSave}
          data-dismiss="modal"
        >
          Save
        </button>
      ))
    : (shownButton = (
        <button
          type="button"
          className="btn btn-primary"
          onClick={props.handleNextButtonPress}
        >
          Next
        </button>
      ));

  return (
    <React.Fragment>
      <div className="modal-body">{shownComponent}</div>
      <div className="modal-footer">
        {shownButton}
        <button type="button" className="btn btn-danger" data-dismiss="modal">
          Cancel
        </button>
      </div>
    </React.Fragment>
  );
};

export default MassModal;
