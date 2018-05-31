import React, { Component } from 'react';
import Info from './main/Info';
import Endof from './main/Endof';
import Metrics from './main/Metrics';
import Overview from './main/Overview';
import Hypothesis from './main/Hypothesis';
import Logs from './main/Logs';
import * as util from '../util/utils';
import * as api from '../api/api';


class Main extends Component {

  constructor(props) {
    super(props);
    let exp = props.experiment;
    this.updateMetrics(exp);
    this.setInterval(exp);
    this.state = {
      metrics: util.processMetrics(exp, []),
      preparing: false
    };
  }

  componentWillReceiveProps(next) {
    let exp = next.experiment;
    this.updateMetrics(exp);
    this.setInterval(exp);
    this.setState({
      metrics: util.processMetrics(exp, []),
      preparing: false
    });
  }

  componentWillUnmount = () =>{
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  setInterval(exp) {
    if (this.interval) clearInterval(this.interval);
    if (exp["status"]["type"] === "running"
     && util.computePercentage(exp) < 100) {
       this.interval = setInterval(() => {
         this.updateMetrics()
       }, 5000);
     }
  }

  updateMetrics(exp = this.props.experiment) {
    api.getMetrics(exp["id"])
      .then(data => {
        this.setState({...this.state,
          metrics: util.processMetrics(exp, data)
        });
      }).catch(err =>
        console.log(err));
  }

  run(exp) {
    api.runExperiment(exp["id"]);
    this.setState({...this.state,
      preparing: true
    });
  }

  evaluateOutcomes() {
    let exp = this.props.experiment;
    return exp["metrics"].map((metric, i) => {
      return {...metric,
        result: this.state.metrics[i]["value"],
        status: this.state.metrics[i]["status"]
      }
    }).filter((metric) => {
      return metric["key"];
    })
  };

  renderOutcome(outcome) {
    switch (outcome) {
      case "succeeded":
        return (
          <h1 className="pull-right">
            <span className="main-light">Successful</span>
            <i className={"fa fa-check-circle outcome-icon success"}/>
          </h1>
        );
      case "interrupted":
        return (
          <h1 className="pull-right">
            <span className="main-light">Interrupted</span>
            <i className={"fa fa-minus-circle outcome-icon interrupt"}/>
          </h1>
        );
      case "failed":
        return (
          <h1 className="pull-right">
            <span className="main-light">Unsuccessful</span>
            <i className={"fa fa-times-circle outcome-icon failure"}/>
          </h1>
        );
      default:
        return <div></div>;
    }
  }

  renderHeader() {
    let exp = this.props.experiment;
    let date = util.computeUntilDate(exp).toLocaleDateString('en-GB', {
      day:'numeric', month:'long', year:'numeric'
    });
    switch (exp["status"]["type"]) {
      case "planned":
        return (this.state.preparing) ? (
          <button type="button" className="btn btn-light pull-right run-btn disabled">
            <i className="fa fa-circle-o-notch fa-spin fa-fw"/>
            {" Preparing"}
          </button>
        ) : (
          <button type="button" onClick={() => {this.run(exp)}}
            className="btn btn-info pull-right run-btn">
            Run Experiment
          </button>
        ) ;
      case "running":
        return (
          <h1 className="pull-right">{util.computePercentage(exp)}%
            <span className="main-light"> until {date}</span>
          </h1>
        );
      case "past":
        return this.renderOutcome(exp["status"]["outcome"]);
      default:
        return <div></div>;
    }
  }

  renderEndOfExperiment(outcomes) {
    let exp = this.props.experiment;
    if (exp["status"]["type"] === "running"
      && util.computeUntilDate(exp) < new Date()) {
      return (
        <section className="row">
          <Endof experiment={exp} outcomes={outcomes} toggleEdit={this.props.toggleEdit}/>
        </section>
      );
    }
  }

  render() {
    let exp = this.props.experiment;
    let outcomes = this.evaluateOutcomes();
    return (
      <main role="main" className="col-sm-9 ml-sm-auto col-md-10 pt-3">
        {this.renderHeader()}
        <h1>"{exp["info"]["title"]}"</h1>
        {this.renderEndOfExperiment(outcomes)}
        <section className="row">
          <Info experiment={exp} toggleEdit={this.props.toggleEdit}/>
          <Overview experiment={exp} outcomes={outcomes} toggleEdit={this.props.toggleEdit}/>
        </section>
        <div>
          <h2 className="header-spaced">Experiment Details</h2>
          <section className="row">
            <Hypothesis experiment={exp} toggleEdit={this.props.toggleEdit}/>
            <Logs experiment={exp}/>
          </section>
        </div>
        <div>
          <h2 className="header-spaced">Experiment Metrics</h2>
          <section className="row">
            <Metrics experiment={exp} metrics={this.state.metrics} toggleEdit={this.props.toggleEdit}/>
          </section>
        </div>
      </main>
    );
  }
}

export default Main;
