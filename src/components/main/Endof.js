import React, { Component } from 'react';
import { renderUnit } from '../../util/utils';
import * as api from '../../api/api';


class Endof extends Component {

  state = {
    description: "Choose from the above options how you would like to proceed.",
    processing: ""
  }

  componentWillReceiveProps = () => {
    this.setState({...this.state,
      processing: ""
    });
  }

  resetDescription = () => {
    this.setState({...this.state,
      description: "Choose from the above options how you would like to proceed."
    });
  }

  setDescription = (description) => {
    this.setState({...this.state,
      description: description
    });
  }

  endExperiment(success) {
    let id = this.props.experiment["id"];
    api.endExperiment(id, success);
    this.setState({...this.state,
      processing: "end"
    });
  }

  mergeExperiment(success) {
    let id = this.props.experiment["id"];
    api.mergeExperiment(id, success);
    this.setState({...this.state,
      processing: "merge"
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
    let pro = this.state.processing;
    let button = (pro) ? ((pro === "end") ? "active" : "disabled") : "";
    let successEnd = "End this experiment. Merge and deploy the successful branch manually later.";
    let failureEnd = "End this experiment. The deployment of the unsuccessful branch will be removed.";
    let text = (pro === "end") ? (<i className="fa fa-circle-o-notch fa-spin fa-fw"/>) : "End Experiment";
    return (success) ? (
      <button type="button" onMouseEnter={() => this.setDescription(successEnd)} onMouseLeave={this.resetDescription} onClick={()=>{this.endExperiment(success)}}
        className={"btn btn-endof btn-success " + button}>
        {text}
      </button>
    ) : (
      <button type="button" onMouseEnter={() => this.setDescription(failureEnd)} onMouseLeave={this.resetDescription} onClick={()=>{this.endExperiment(success)}}
        className={"btn btn-endof btn-warning " + button}>
        {text}
      </button>
    );
  }

  renderMergeButton(success) {
    let pro = this.state.processing;
    let button = (pro) ? ((pro === "merge") ? "active" : "disabled") : "";
    let successMerge = "Automatically merge and deploy the branch with the successful changes.";
    let failureMerge = "Merge and deploy the experimental branch despite the failed experiment.";
    let text = (pro === "merge") ? (<i className="fa fa-circle-o-notch fa-spin fa-fw"/>) : "Merge Experiment";
    return (success) ? (
      <button type="button" onMouseEnter={() => this.setDescription(successMerge)} onMouseLeave={this.resetDescription} onClick={()=>{this.mergeExperiment(success)}}
        className={"btn btn-endof btn-success " + button}>
        {text}
      </button>
    ) : (
      <button type="button" onMouseEnter={() => this.setDescription(failureMerge)} onMouseLeave={this.resetDescription} onClick={()=>{this.mergeExperiment(success)}}
        className={"btn btn-endof btn-warning " + button}>
        {text}
      </button>
    );
  }

  renderExtendButton() {
    let button = (this.state.processing) ? "disabled" : "";
    let extend = "Prolong the duration of this experiment and keep collecting metrics.";
    return (
      <button type="button" onMouseEnter={() => this.setDescription(extend)} onMouseLeave={this.resetDescription} onClick={this.props.toggleEdit}
        className={"btn btn-endof btn-secondary " + button}>
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
