import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavBar extends Component {
  state = {
    theme: "normal",
  };

  getTheme = (snapshot) => {
    this.setState({ theme: snapshot.val() });
  };

  componentDidMount() {
    this.props.db.ref("theme").on("value", this.getTheme);
  }

  renderAdmin = () => {
    // eslint-disable-next-line
    if (localStorage.getItem("userType") == 3) {
      return (
        <React.Fragment>
          <Link to="/setTheme">
            <li className="nav-item nav-link" data-toggle="offcanvas">
              Set Theme
            </li>
          </Link>
          <Link to="/addPack">
            <li className="nav-item nav-link" data-toggle="offcanvas">
              Add Pack
            </li>
          </Link>
          <Link to="/addHymn">
            <li className="nav-item nav-link" data-toggle="offcanvas">
              Add Hymn
            </li>
          </Link>
        </React.Fragment>
      );
    }
  };

  render() {
    let theme = "navbar navbar-expand-lg fixed-top ";
    let badgeTheme = "badge badge-";
    switch (this.state.theme) {
      case "Blue":
        theme += "bg-primary navbar-dark";
        badgeTheme += "light";
        break;
      case "Violet":
        theme += "navbar-dark bg-violet";
        badgeTheme += "light";
        break;
      case "White":
        theme += "bg-light navbar-light";
        badgeTheme += "secondary";
        break;
      case "Red":
        theme += "bg-danger navbar-dark";
        badgeTheme += "light";
        break;
      case "Rose":
        theme += "navbar-dark bg-rose";
        badgeTheme += "light";
        break;
      case "Green":
        theme += "bg-success navbar-dark";
        badgeTheme += "light";
        break;
      case "Black":
        theme += "bg-dark navbar-dark";
        badgeTheme += "light";
        break;
      default:
        theme += "bg-light navbar-light";
        badgeTheme += "secondary";
        break;
    }
    return (
      <nav className={theme}>
        <span className="navbar-brand mr-auto mr-lg-0">
          <span className={badgeTheme}>SUCC</span>
          <small className="ml-1">{this.props.navTitle}</small>
        </span>
        <button
          className="navbar-toggler p-0 border-0"
          type="button"
          data-toggle="offcanvas"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="navbar-collapse offcanvas-collapse"
          id="navbarsExampleDefault"
        >
          <ul className="navbar-nav mr-auto">
            <Link to="/Mass">
              <li className="nav-item nav-link" data-toggle="offcanvas">
                Mass
              </li>
            </Link>
            <Link to="/hymns">
              <li className="nav-item nav-link" data-toggle="offcanvas">
                Hymns
              </li>
            </Link>
            <Link to="/favourites">
              <li className="nav-item nav-link" data-toggle="offcanvas">
                Favourites
              </li>
            </Link>
            {this.renderAdmin()}
          </ul>
        </div>
      </nav>
    );
  }
}

export default NavBar;
