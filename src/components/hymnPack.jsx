import React from "react";
const HymnPack = (props) => {
  let badgeTheme = "badge pt-2 pb-1 px-2 badge-pill " + props.badgeThemeProp;
  return (
    <React.Fragment>
      {props.hymnPack.packName}
      <span className={badgeTheme}>{props.hymnPack.packSize}</span>
    </React.Fragment>
  );
};

export default HymnPack;
