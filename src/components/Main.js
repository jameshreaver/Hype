import React, { Component } from 'react';
import Info from './main/Info';
import Overview from './main/Overview';
import Hypothesis from './main/Hypothesis';
import Rules from './main/Rules';
import Metrics from './main/Metrics';
import { computeUntilDate } from '../util/utils';
import { computePercentage } from '../util/utils';


class Main extends Component {

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
    let date = computeUntilDate(exp).toLocaleDateString('en-GB', {
      day:'numeric', month:'long', year:'numeric'
    })
    switch (exp["status"]["type"]) {
      case "planned":
        return (
          <button type="button"
            className="btn btn-info pull-right run-btn">
            Run Experiment
          </button>
        );
      case "running":
        return (
          <h1 className="pull-right">{computePercentage(exp)}%
            <span className="main-light"> until {date}</span>
          </h1>
        );
      case "past":
        return this.renderOutcome(exp["status"]["outcome"]);
      default:
        return <div></div>;
    }
  }

  render() {
    let exp = this.props.experiment;

    return (
      <main role="main" className="col-sm-9 ml-sm-auto col-md-10 pt-3">
        {this.renderHeader()}
        <h1>"{exp["info"]["title"]}"</h1>
        <section className="row">
          <Info experiment={exp} toggleEdit={this.props.toggleEdit}/>
          <Overview experiment={exp}/>
        </section>
        <div>
          <h2 className="header-spaced">Experiment Details</h2>
          <section className="row">
            <Hypothesis experiment={exp} toggleEdit={this.props.toggleEdit}/>
            <Rules experiment={exp} toggleEdit={this.props.toggleEdit}/>
          </section>
        </div>
        <div>
          {/*<h2 className="header-spaced">Metrics</h2>*/}
          {/*<Metrics/>*/}
        </div>
      </main>
    );
  }
}

export default Main;
