import React, { Component } from 'react';

class Sidebar extends Component {

  data = {
    "planned-experiments": [
      {"name":"Rate Reviews","complete":0,"status":"Planned"},
      {"name":"Employ Redux","complete":0,"status":"Planned"},
      {"name":"Browse by Genre","complete":0,"status":"Planned"},
      {"name":"Sign-In Feature","complete":0,"status":"Planned"}
    ],
    "running-experiments": [
      {"name":"Show Recent Reviews","complete":40,"status":"Running", "selected":true},
      {"name":"Use NeDB","complete":66,"status":"Running"},
      {"name":"Browse by Year","complete":98,"status":"Running"}
    ],
    "past-experiments": [
      {"name":"Show Book Covers","complete":72,"status":"Interrupt"},
      {"name":"Snap a Review!","complete":100,"status":"Success"},
      {"name":"Star Ratings","complete":100,"status":"Success"},
      {"name":"Use RethinkDB","complete":100,"status":"Failure"}
    ]
  }

  renderPendingExperiments = () => {
    return this.data["planned-experiments"].map((exp) => {
      return (
        <li className="nav-item">
          <a className="nav-link" href="">{exp["name"]}</a>
        </li>
    )});
  }

  renderRunningExperiments = () => {
    return this.data["running-experiments"].map((exp) => {
      let selected = exp["selected"] ? "selected" : "";
      return (
        <li className="nav-item">
          <a className={"nav-link " + selected} href="">{exp["name"]}
            <span className="badge badge-light float-right">{exp["complete"]}%</span>
          </a>
        </li>
    )});
  }

  renderPastExperiments = () => {
    return this.data["past-experiments"].map((exp) => {
      let attr = "";
      switch(exp["status"]) {
        case "Interrupt" :
          attr = "fa-minus-circle interrupt"; break;
        case "Success" :
          attr = "fa-check-circle success"; break;
        case "Failure" :
          attr = "fa-times-circle failure"; break;
        default :
          attr = "fa-circle"; break;
      }
      return (
        <li className="nav-item">
          <a className="nav-link" href="">
            <i className={"fa sidebar-icon " + attr}/>{exp["name"]}
          </a>
        </li>
    )});
  }

  render() {
    return (
      <nav className="col-sm-3 col-md-2 d-none d-sm-block bg-dark sidebar">
        <ul className="nav nav-pills flex-column">
          <li className="nav-item">
            <span className="nav-link disabled sidebar-txt">Planned Experiments</span>
          </li>
          {this.renderPendingExperiments()}
        </ul>
        <ul className="nav nav-pills flex-column">
          <li className="nav-item">
            <span className="nav-link disabled sidebar-txt">Running Experiments</span>
          </li>
          {this.renderRunningExperiments()}
        </ul>
        <ul className="nav nav-pills flex-column">
          <li className="nav-item">
            <span className="nav-link disabled sidebar-txt">Past Experiments</span>
          </li>
          {this.renderPastExperiments()}
        </ul>
      </nav>
    );
  }
}

export default Sidebar;
