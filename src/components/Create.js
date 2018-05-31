import React, { Component } from 'react';
import Info from './create/Info';
import Hypothesis from './create/Hypothesis';
import Settings from './create/Settings';
import Metrics from './create/Metrics';

import uuidv4 from 'uuid';
import { postExperiment } from '../api/api';


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
    let logs = old ? exp.logs : [];
    postExperiment({
      "id" : id,
      "info" : this.info.getInfo(),
      "hypothesis" : this.hypo.getInfo(),
      "settings": this.settings.getInfo(),
      "metrics" : this.metrics.getInfo(),
      "status" : status,
      "time" : time,
      "logs" : logs
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
          <Settings experiment={exp} ref={(settings) => {this.settings = settings}}/>
        </section>
        <section className="row">
          <Hypothesis experiment={exp} ref={(hypo) => {this.hypo = hypo}}/>
        </section>
        <section className="row">
          <Metrics experiment={exp} ref={(metrics) => {this.metrics = metrics}}/>
        </section>
      </main>
    );
  }
}

export default Create;
