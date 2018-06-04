import React, { Component } from 'react';
import { computePercentage } from '../util/compute';
import { getExperiments } from '../api/api';

class Sidebar extends Component {

  state = {
    experiments: []
  };

  componentDidMount() {
    getExperiments()
      .then(res => {
        this.setState({
          experiments: res
        });
      })
      .catch(err =>
        console.log(err));
  }

  renderPlannedExperiments = () => {
    return this.state.experiments
      .filter(exp => exp["status"]["type"] === "planned")
      .map((exp) => {
      let selected = exp["id"] === this.props.info.selected ? "selected" : "";
      return (
        <li className="nav-item" key={exp["id"]}>
          <a className={"nav-link " + selected}
             onClick={() => this.props.select(exp["id"])}>
             {exp["info"]["title"]}
          </a>
        </li>
    )});
  }

  renderRunningExperiments = () => {
    return this.state.experiments
      .filter(exp => exp["status"]["type"] === "running")
      .map((exp) => {
      let percentage = computePercentage(exp);
      let selected = exp["id"] === this.props.info.selected
        ? "selected" : "";
      if (percentage === 100) selected += " completed";
      return (
        <li className="nav-item" key={exp["id"]}>
          <a className={"nav-link " + selected}
             onClick={() => this.props.select(exp["id"])}>
            {exp["info"]["title"]}
            <span className="badge badge-light float-right">
              {percentage}%
            </span>
          </a>
        </li>
    )});
  }

  renderPastExperiments = () => {
    return this.state.experiments
      .filter(exp => exp["status"]["type"] === "past")
      .map((exp) => {
      let attr = "";
      switch(exp["status"]["outcome"]) {
        case "interrupted" :
          attr = "fa-minus-circle interrupt"; break;
        case "succeeded" :
          attr = "fa-check-circle success"; break;
        case "failed" :
          attr = "fa-times-circle failure"; break;
        default :
          attr = "fa-circle"; break;
      }
      let selected = exp["id"] === this.props.info.selected
        ? "selected" : "";
      return (
        <li className="nav-item" key={exp["id"]}>
          <a className={"nav-link " + selected}
             onClick={() => this.props.select(exp["id"])}>
            <i className={"fa sidebar-icon " + attr}/>
            {exp["info"]["title"]}
          </a>
        </li>
    )});
  }

  render() {
    let plannedExperiments = this.renderPlannedExperiments();
    let runningExperiments = this.renderRunningExperiments();
    let pastExperiments = this.renderPastExperiments();
    let btnClass = (this.props.info.editing) ? "" : "btn-light";
    return (
      <nav className="col-sm-3 col-md-2 d-none d-sm-block bg-dark sidebar">
        <ul className="nav nav-pills flex-column">
          <li className="nav-item">
            <span className="nav-link">
              <button className={"btn sidebar-btn " + btnClass} onClick={this.props.toggleCreate}>
                {(this.props.info.editing) ? "Cancel" : "+ New Experiment"}
              </button>
            </span>
          </li>
        </ul>
        <ul className="nav nav-pills flex-column">
          {(plannedExperiments.length === 0 ? <div></div> :
          (<li className="nav-item">
            <span className="nav-link disabled sidebar-txt">
              Planned Experiments
            </span>
           </li>))}
          {plannedExperiments}
        </ul>
        <ul className="nav nav-pills flex-column">
          {(runningExperiments.length === 0 ? <div></div> :
          (<li className="nav-item">
            <span className="nav-link disabled sidebar-txt">
              Running Experiments
            </span>
           </li>))}
          {runningExperiments}
        </ul>
        <ul className="nav nav-pills flex-column">
          {(pastExperiments.length === 0 ? <div></div> :
          (<li className="nav-item">
            <span className="nav-link disabled sidebar-txt">
              Past Experiments
            </span>
           </li>))}
          {pastExperiments}
        </ul>
      </nav>
    );
  }
}

export default Sidebar;
