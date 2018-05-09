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
        <div className="card">
          <h5 className="card-header text-center">
            Experiment Overview
            <button href="" className="btn badge badge-secondary main-tag pull-right" onClick={this.props.toggleEdit}>
              Edit
            </button>
          </h5>
          <div className="card-block">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <section className="row">
                  <div className="col-sm-4 version-left">
                      <div className="card-subtext spaced">
                        Version A
                      </div>
                  </div>
                  <div className="col-sm-4 text-center">
                    <div className="text-center">
                      <span className="routing-percentages">
                        {100-exp["rules"]["percentage"]}%
                      </span>
                      <span className="routing-spaced"/>
                      <span className="routing-percentages">
                        {exp["rules"]["percentage"]}%
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-4 version-right">
                      <div className="card-subtext text-right spaced">
                        Version B
                      </div>
                  </div>
                </section>
                <div className="col-sm-12">
                    <div className="monospace pull-right">
                      {exp["service"]["name"] + '-b'}
                    </div>
                    <div className="monospace">
                      {exp["service"]["name"] + '-a'}
                    </div>
                </div>
                <section className="row">
                  <div className="col-sm-12 routing-icon">
                    <div className="card-subtext text-center spaced">
                      <i className="fa fa-long-arrow-left routing-arrow-left fa-3x"></i>
                      <span className="fa-stack fa-2x">
                        <i className="fa fa-arrows fa-stack-1x"></i>
                        <i className="fa fa-circle-thin fa-stack-2x"></i>
                      </span>
                      <i className="fa fa-long-arrow-right routing-arrow-right fa-3x"></i>
                    </div>
                  </div>
                </section>
              </li>
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
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Overview;
