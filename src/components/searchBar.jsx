import React from "react";
const SearchBar = (props) => {
  let buttonClass = "btn btn-primary " + props.themeProp;
  return (
    <form className="form-inline m-2">

      <div className="input-group mb-3">
            <input
              className="form-control"
              type="text" 
              aria-describedby="basic-addon2"
              value={props.keywords}
              onChange={props.onHandleChange}
              placeholder="Search hymn"
              aria-label="Search"
            />
            <div className="input-group-append">
            <button type="button" id="button-addon2" className={buttonClass} onClick={props.onHandleClick}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
        <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
      </svg></button></div>
      </div>
    </form>
  );
};

export default SearchBar;
