import React, { Component } from 'react';


class Logs extends Component {

  renderIcon(message) {
    switch(message) {
      case "created": return "fa-check-circle";
      case "edited":  return "fa-check-circle";
      case "started": return "fa-play-circle";
      case "ended":   return "fa-minus-circle";
      case "merged":  return "fa-minus-circle";
      default: return "";
    }
  }

  renderMessage(message) {
    let exp = this.props.experiment;
    let title = exp["info"]["title"];
    let mainbranch = exp["settings"]["main-branch"];
    let expbranch = exp["settings"]["exp-branch"];
    switch(message) {
      case "created":
        return "Experiment \""+title+"\" created with success.";
      case "edited":
        return "Changes to experiment \""+title+"\" saved successfully.";
      case "started":
        return "Experiment started running on branches \""+mainbranch+"\" and \""+expbranch+"\".";
      case "ended":
        return "Experiment ended. Branch \""+expbranch+"\" removed.";
      case "merged":
        return "Experiment merged. Experimental branch \""+expbranch+"\" deployed.";
      default:
        return "";
    }
  }

  renderLog(log, i) {
    let message = log["message"];
    let date = new Date(log["date"]);
    return (
      <div key={i} className="">
        <span className="text-muted">
          {date.toLocaleDateString('en-GB')}
          <i className={"fa fa-angle-right logs-icon-date"}/>
          {date.toLocaleTimeString('en-GB')}
          <i className={"fa fa-angle-double-right logs-icon-time"}/>
        </span>
        <i className={"fa logs-icon "+this.renderIcon(message)}/>
        {this.renderMessage(message)}
      </div>
    );
  }

  renderLogs() {
    let exp = this.props.experiment;
    return exp["logs"].map((log, i) => {
      return this.renderLog(log, i);
    });
  }

  render() {
    return (
      <div className="col-sm-7">
        <div className="card card-logs">
          <h5 className="card-header text-center">
            Experiment Logs
          </h5>
          <div className="card-block card-block-logs">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                {this.renderLogs()}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Logs;
