import React, { Component } from 'react';
import { computePercentage } from '../../util/compute';
import * as render from '../../util/render';


class Overview extends Component {

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

  computeMetricPercentage(metric) {
    let change = metric["change"];
    let result = metric["result"];
    let value = metric["value"];
    let x = (change === ">-" || change === "-") ? -result : result;
    let a = (change === ">-" || change === "<+") ? 3*value : -value;
    let percentage = (x-a)*100/(value-a);
    percentage = Math.max(Math.min(percentage, 100), 0);
    return percentage;
  }

  renderKeyMetric(outcome, i) {
    let unit = render.renderUnit(outcome["unit"]);
    let perc = this.computeMetricPercentage(outcome);
    let bg = "bg-success";
    if (perc < 50) {
      bg = "bg-danger";
    } else if (perc < 100) {
      bg = "bg-warning";
    }
    return (
      <li key={i} className="list-group-item">
        <div className="row">
          <div className="col-sm-3 card-subtext">
            #{i+1} {render.renderType(outcome["type"])}
          </div>
          <div className="col-sm-9">
            <div className="progress progress-metric">
              <div className={"progress-bar "+bg} role="progressbar" style={{width:perc+"%"}}>
                {render.renderValue(outcome["result"], unit)+" ("+outcome["change"]+outcome["value"]+unit+")"}
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }

  renderKeyMetrics() {
    let outcomes = this.props.outcomes;
    return outcomes.map((outcome, i) => {
      return this.renderKeyMetric(outcome, i);
    })
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
                        {exp["settings"]["percentage"]}%
                      </span>
                      <span className="routing-spaced"/>
                      <span className="routing-percentages">
                        {100-exp["settings"]["percentage"]}%
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
                      {exp["settings"]["exp-branch"]}
                    </div>
                    <div className="monospace">
                      {exp["settings"]["main-branch"]}
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
              {this.renderKeyMetrics()}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Overview;
