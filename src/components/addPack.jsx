import React, { Component } from "react";
class AddPack extends Component {
  state = {
    packName: "",
    hymnPacks: [],
    loading: true,
    showToast: false,
    successful: false,
    task: "",
  };

  getPacks = (snapshot) => {
    var hymnPacks = [];
    snapshot.forEach(function (childSnapshot) {
      hymnPacks.push({
        packId: childSnapshot.key,
        packName: childSnapshot.val().packName,
        packSize: childSnapshot.val().packSize,
      });
    });
    this.setState({ hymnPacks });
    this.setState({ loading: false });
  };

  componentDidMount() {
    this.props.setNavTitle("Add hymn pack");
    this.props.db.ref("hymn_packs").on("value", this.getPacks);
  }

  componentWillUnmount() {
    this.props.db.ref("hymn_packs").off("value", this.getPacks);
  }

  handleChange = (event) => {
    const input = event.target;
    this.setState({ [input.name]: input.value });
  };

  handleDbFeedback = (error) => {
    if (error) {
      // The write failed...
      this.setState({ showToast: true, successful: false });
      setTimeout(() => this.setState({ showToast: false }), 3000);
    } else {
      this.setState({ showToast: true, successful: true });
      setTimeout(() => this.setState({ showToast: false }), 3000);
    }
  };

  addHymnPack = (hymnPackName) => {
    this.setState({ task: "Adding" });
    const packId = this.props.db.ref("hymn_packs").push().key;
    this.props.db.ref("hymn_packs/" + packId).set(
      {
        packName: hymnPackName,
        packSize: 0,
      },
      this.handleDbFeedback
    );
  };

  renderFeedback = (isSuccessful, task) => {
    if (this.state.showToast) {
      return isSuccessful ? (
        <div className="alert alert-success fixed-bottom" role="alert">
          {task + " successful!"}
        </div>
      ) : (
        <div className="alert alert-danger fixed-bottom" role="alert">
          {task + " failed!"}
        </div>
      );
    }
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    this.addHymnPack(this.state.packName);
    this.setState({ packName: "" });
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

  deletePack = (packId) => {
    this.setState({ task: "Deleting" });
    this.props.db
      .ref("hymn_packs/" + packId)
      .remove()
      .then(this.handleDbFeedback)
      .catch(this.handleDbFeedback);
  };

  render() {
    return (
      <div>
        <br />
        {this.showHideLoader()}
        {this.renderFeedback(this.state.successful, this.state.task)}
        <form onSubmit={this.handleFormSubmit}>
          <div className="form-group">
            <label>Add hymn pack</label>
            <input
              type="text"
              value={this.state.packName}
              name="packName"
              onChange={this.handleChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
        <br />
        {this.state.hymnPacks.map((hymnPack) => (
          <li
            key={hymnPack.packId}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {hymnPack.packName}
            <span
              className="btn btn-small btn-secondary"
              onClick={() => this.deletePack(hymnPack.packId)}
            >
              Delete
            </span>
          </li>
        ))}
      </div>
    );
  }
}

export default AddPack;
