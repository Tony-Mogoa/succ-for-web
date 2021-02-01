import React from "react";
import { Link } from "react-router-dom";

const HymnInList = (props) => {
  // props.badgeThemeProp;
  let badgeTheme = "badge pt-1 pd-1 px-2 badge-pill " + props.badgeThemeProp;
  return (
    <React.Fragment>
      <div className="d-flex justify-content-between w-100">
        <div>
          <div className="link-div">
            <Link to={props.to} className="stretched-link link-in-list">
              <h5 className="mb-1">{props.hymnInList.title}</h5>
            </Link>
            <div className="d-sm-flex w-100  bd-highlight">
              <span className={badgeTheme + " m-1 bd-highlight"}>
                {props.hymnInList.hymnal}
              </span>
              <span className={badgeTheme + " m-1 bd-highlight"}>
                page:{props.hymnInList.hymnPage}
              </span>
              <span className={badgeTheme + " m-1 bd-highlight"}>
                number:{props.hymnInList.hymnNumber}
              </span>
            </div>
          </div>
        </div>
        <div>
          <svg
            width="1.5em"
            height="1.5em"
            viewBox="0 0 16 16"
            className="bi bi-three-dots-vertical options rounded-circle"
            data-toggle="modal"
            data-target="#hymnOptions"
            onClick={() => props.onSetHymn(props.hymnInList)}
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
            />
          </svg>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HymnInList;
