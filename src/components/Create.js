import React, { Component } from 'react';
import Info from './create/Info';
import Hypothesis from './create/Hypothesis';
import Versions from './create/Versions';
import Rules from './create/Rules';
import Metrics from './create/Metrics';

import uuidv4 from 'uuid';
import { postExperiment } from '../api/contentAPI';


class Create extends Component {

  onSave = (old) => {
    let exp = this.props.experiment;
    let id = old ? exp.id : uuidv4();
    let status = old ? exp.status : {
      "type":"planned",
      "outcome":"unknown"
    };
    let time = old ? exp.time : {
      "added": new Date().toJSON(),
      "started":"",
      "stopped":""
    };
    postExperiment({
      "id" : id,
      "info" : this.info.state,
      "hypothesis" : this.hypo.state,
      "versions": this.versions.state,
      "rules" : this.rules.state,
      "metrics" : this.metrics.state.metrics,
      "status" : status,
      "time" : time
    })
  }

  render() {
    let exp = this.props.experiment;
    let old = Object.keys(exp).length !== 0;
    return (
      <main role="main" className="col-sm-9 ml-sm-auto col-md-10 pt-3">
        <button type="button" className="btn btn-info pull-right save-btn"
         onClick={() => this.onSave(old)}>
          Save
        </button>
        <h1 className="center">
          {old ? "Edit " : "Create "} Experiment
        </h1>
        <section className="row">
          <Info experiment={exp} ref={(info) => {this.info = info}}/>
          <Hypothesis experiment={exp} ref={(hypo) => {this.hypo = hypo}}/>
        </section>
        <section className="row">
          <Versions experiment={exp} ref={(versions) => {this.versions = versions}}/>
          <Rules experiment={exp} ref={(rules) => {this.rules = rules}}/>
        </section>
        <section className="row">
          <Metrics experiment={exp} ref={(metrics) => {this.metrics = metrics}}/>
        </section>
      </main>
    );
  }
}

export default Create;
