import React, { Component } from 'react';
import { renderUnit } from '../../util/utils';

class Endof extends Component {

  state = {
    description: "Choose from the above options how you would like to proceed."
  }

  resetDescription = () => {
    this.setState({
      description: "Choose from the above options how you would like to proceed."
    });
  }

  setDescription = (description) => {
    this.setState({
      description: description
    });
  }

  renderKeyMetrics(outcomes) {
    return outcomes.map((o, i) => {
      let unit = renderUnit(o["unit"]);
      let icon = (o["status"]) ? "fa-check" : "fa-times";
      return (
        <span key={i}>
          <i className={"fa metrics-icon " + icon}/>
          Number of <strong>{o["type"]+"s"}</strong> on element "<a className="monospace">{o["elem"]}</a>" (<a className="card-subtext">{o["result"]+unit}</a>)
          <br/>
        </span>
      )
    });
  }

  renderEndButton(success) {
    let successEnd = "End this experiment. Merge and deploy the successful branch manually later.";
    let failureEnd = "End this experiment. The deployment of the unsuccessful branch will be removed.";
    return (success) ? (
      <button type="button" onMouseEnter={() => this.setDescription(successEnd)} onMouseLeave={this.resetDescription}
        className={"btn btn-endof btn-success"}>
        End Experiment
      </button>
    ) : (
      <button type="button" onMouseEnter={() => this.setDescription(failureEnd)} onMouseLeave={this.resetDescription}
        className={"btn btn-endof btn-warning"}>
        End Experiment
      </button>
    );
  }

  renderMergeButton(success) {
    let successMerge = "Automatically merge and deploy the branch with the successful changes.";
    let failureMerge = "Merge and deploy the experimental branch despite the failed experiment.";
    return (success) ? (
      <button type="button" onMouseEnter={() => this.setDescription(successMerge)} onMouseLeave={this.resetDescription}
        className={"btn btn-endof btn-success"}>
        Merge Experiment
      </button>
    ) : (
      <button type="button" onMouseEnter={() => this.setDescription(failureMerge)} onMouseLeave={this.resetDescription}
        className={"btn btn-endof btn-warning"}>
        Merge Experiment
      </button>
    );
  }

  renderExtendButton() {
    let extend = "Prolong the duration of this experiment and keep collecting metrics.";
    return (
      <button type="button" onMouseEnter={() => this.setDescription(extend)} onMouseLeave={this.resetDescription} onClick={this.props.toggleEdit}
        className={"btn btn-endof btn-secondary"}>
        Extend Experiment
      </button>
    );
  }

  renderMessage(success) {
    return (success) ? (
      <p>This experiment has come to an end. All your key metrics for this experiment have been fulfilled, therefore this experiment was a success.<br/>Here is a summary of the results for the key metrics collected:</p>
    ) : (
      <p>This experiment has come to an end. Some or all of your key metrics have <strong>not</strong> been fulfilled, therefore this experiment did not succeed.<br/>Here is a summary of the results for the key metrics collected:</p>
    );
  }

  render() {
    let outcomes = this.props.outcomes;
    let success = outcomes.every((o) => o["status"]);
    return (
      <div className="col-sm-12 container-endof">
        <div className={"alert alert-" + ((success)?"success":"warning")} role="alert">
          <h4 className="alert-heading">
            <i className={"fa sidebar-icon " + ((success)?"fa-check-circle":"fa-exclamation-circle")}/>
            {"Experiment " + ((success)?"succeeded.":"did not succeed.")}
          </h4>
          {this.renderMessage(success)}
          {this.renderKeyMetrics(outcomes)}
          <hr/>
          {this.renderEndButton(success)}
          {this.renderMergeButton(success)}
          {this.renderExtendButton()}
          <p className="desc-endof"><small>
            {this.state.description}
          </small></p>
        </div>
      </div>
    );
  }
}

export default Endof;
