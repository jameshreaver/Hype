import React, { Component } from 'react';
import { computeUntilDate } from '../../util/compute';

class Info extends Component {

  getDuration(exp) {
    let duration = exp["info"]["duration"];
    let unit = duration;
    switch (exp["info"]["durationunit"]) {
      case "d": unit += " Day"; break;
      case "w": unit += " Week"; break;
      case "m": unit += " Month"; break;
      default: break;
    }
    if (duration > 1) {
      unit += "s";
    }
    return unit;
  }

  renderDates(exp) {
    if (exp["status"]["type"]==="planned") {
      return (
        <div className="row">
          <div className="col-sm-3 card-subtext">
            Duration
          </div>
          <div className="col-sm-9">
            {this.getDuration(exp)}
          </div>
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="col-sm-6">
            <div className="row">
              <div className="col-sm-6 card-subtext">
                From
              </div>
              <div className="col-sm-6">
                {new Date(exp["time"]["started"]).toLocaleDateString('en-GB')}
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="row">
              <div className="col-sm-3 card-subtext">
                to
              </div>
              <div className="col-sm-9">
                {computeUntilDate(exp).toLocaleDateString('en-GB')}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  renderStatus(status) {
    switch(status) {
      case "planned":
        return (
          <div className="col-sm-9 card-status planned">
            Ready to Run
          </div>
        );
      case "running":
        return (
          <div className="col-sm-9 card-status running">
            <i className="fa fa-circle-o-notch fa-spin fa-fw"/>
            {" Running"}
          </div>
        );
      case "past":
      return (
        <div className="col-sm-9 card-status">
          Terminated
        </div>
      );
      default:
        return;
    }
  }

  render() {
    let exp = this.props.experiment;
    return (
      <div className="col-sm-5">
        <div className="card">
          <h5 className="card-header text-center">
            Experiment Info
            <button href="" className="btn badge badge-secondary main-tag pull-right" onClick={this.props.toggleEdit}>
              Edit
            </button>
          </h5>
          <div className="card-block">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Title
                  </div>
                  <div className="col-sm-9">
                    {exp["info"]["title"]}
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Owner
                  </div>
                  <div className="col-sm-9">
                    {exp["info"]["owner"]}
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Target
                  </div>
                  <div className="col-sm-9">
                    {exp["info"]["target"]}
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                {this.renderDates(exp)}
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Branch
                  </div>
                  <div className="col-sm-9 monospace">
                    {exp["settings"]["exp-branch"]}
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="card-footer">
            <div className="row">
              <div className="col-sm-3 card-subtext">
                Status
              </div>
              {this.renderStatus(exp["status"]["type"])}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Info;
