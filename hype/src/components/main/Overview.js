import React, { Component } from 'react';
import Info from './overview/Info';
import Metrics from './overview/Metrics';

class Overview extends Component {

  render() {
    return (
      <section className="row">
        <Info/>
        <Metrics/>
      </section>
    );
  }
}

export default Overview;
