import React, { Component } from 'react';
import { computePercentage } from '../../util/utils';

class Overview extends Component {

  randomNumber(min, max, top) {
    if (this.props.experiment["status"]["type"] === "planned") {
      return (
        <div className="progress-bar bg-warning no-transition" role="progressbar" style={{width:"0%"}}></div>
      );
    }
    min = Math.ceil(min);
    max = Math.floor(max);
    let rand = Math.random();
    let val = Math.floor(rand * (max - min)) + min;
    let dVal = val*top/100;
    let cls = "bg-warning";
    if (rand > 0.70) {
      cls = "bg-success";
    }
    return (
      <div className={"progress-bar "+cls} role="progressbar" style={{width:val+"%"}}>{dVal+"/"+top}</div>
    );
  }

  renderProgressBar(exp) {
    switch (exp["status"]["type"]) {
      case "planned":
        return (
          <div className="progress-bar bg-info progress-bar-striped progress-bar-animated" role="progressbar" style={{width:"0%"}}></div>
        );
      case "running":
        let perc = computePercentage(exp);
        return (
          <div className="progress-bar bg-info progress-bar-striped progress-bar-animated" role="progressbar" style={{width:perc.toString()+"%"}}>{perc}%</div>
        );
      case "past":
        return (
          <div className="progress-bar bg-info" role="progressbar" style={{width:"100%"}}>100%</div>
        );
      default:
        return <div></div>
    }
  }

  render() {
    let exp = this.props.experiment;
    return (
      <div className="col-sm-7">
        <div className="progress progress-main">
          {this.renderProgressBar(exp)}
        </div>
        <h4 className="main-header">Metrics Overview
          <button className="btn badge badge-secondary main-tag pull-right">
            Expand
          </button>
        </h4>
        <div className="card">
          <div className="card-block">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    #1 Page Views
                  </div>
                  <div className="col-sm-9">
                    <div className="progress progress-metric">
                      {this.randomNumber(75,95,40000)}
                    </div>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    #2 Click Rate
                  </div>
                  <div className="col-sm-9">
                    <div className="progress progress-metric">
                      {this.randomNumber(50,80,100)}
                    </div>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    #3 Unique Visits
                  </div>
                  <div className="col-sm-9">
                    <div className="progress progress-metric">
                      {this.randomNumber(20,45,1000)}
                    </div>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    #4 Reviews Read
                  </div>
                  <div className="col-sm-9">
                    <div className="progress progress-metric">
                      {this.randomNumber(65,92,2000)}
                    </div>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    #5 Reviews Added
                  </div>
                  <div className="col-sm-9">
                    <div className="progress progress-metric">
                      {this.randomNumber(20,50,200)}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Overview;
