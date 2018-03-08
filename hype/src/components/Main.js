import React, { Component } from 'react';
import Overview from './main/Overview';
import Hypotheses from './main/Hypotheses';
import Metrics from './main/Metrics';

class Body extends Component {

  data = {
    "experiment": {
      "title":"Browse Button",
      "owner":"Frontend Developers",
      "target":"User Interface",
      "branch":"recent_reviews",
      "from":new Date("2018-02-24"),
      "to":new Date("2018-03-10"),
      "complete":85,
      "status":"Running"
    }
  };

  render() {
    let date = this.data["experiment"]["to"].toLocaleDateString('en-GB', {
      day:'numeric', month:'long', year:'numeric'
    })
    return (
      <main role="main" className="col-sm-9 ml-sm-auto col-md-10 pt-3">
        <h1 className="pull-right">{this.data["experiment"]["complete"]}%
          <span className="main-light"> until {date}</span>
        </h1>
        <h1>"{this.data["experiment"]["title"]}"</h1>
        <Overview/>
        <Hypotheses/>
        <Metrics/>
      </main>
    );
  }
}

export default Body;
