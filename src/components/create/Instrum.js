import React, { Component } from 'react';


class Instrum extends Component {


  renderClick(element, i) {
    return (
      <li key={i} className="list-group-item">
        <input className="form-check-input" type="checkbox"/>
        <span className="monospace method-instrum">
          recordClick("{element}")
        </span> when "{element}" is clicked.
      </li>
    );
  }

  renderPageView(element, i) {
    return (
      <li key={i} className="list-group-item">
        <input className="form-check-input" type="checkbox"/>
        <span className="monospace method-instrum">
          recordPageView("{element}")
        </span> when the page loads.
      </li>
    );
  }

  renderConversion(element, i) {
    return (
      <li key={i} className="list-group-item">
        <input className="form-check-input" type="checkbox"/>
        <span className="monospace method-instrum">
          trackConversionRate("{element}")
        </span> when the page loads.
        <br/>
        <input className="form-check-input" type="checkbox"/>
        <span className="monospace method-instrum">
          recordConversionRate("{element}")
        </span> when the conversion occurs.
      </li>
    );
  }

  renderClicksPerVisit(element, i) {
    return (
      <li key={i} className="list-group-item">
        <input className="form-check-input" type="checkbox"/>
        <span className="monospace method-instrum">
          trackClicksPerVisit("{element}")
        </span> when the page loads.
        <br/>
        <input className="form-check-input" type="checkbox"/>
        <span className="monospace method-instrum">
          recordClickPerVisit("{element}")
        </span> when "{element}" is clicked.
      </li>
    );
  }

  renderMetricMethod(metric, i) {
    let elem = metric.elem;
    switch (metric.type) {
      case "click":
        return this.renderClick(elem, i);
      case "pageview":
        return this.renderPageView(elem, i);
      case "conversion":
        return this.renderConversion(elem, i);
      case "clicksvisit":
        return this.renderClicksPerVisit(elem, i);
      default:
        return "";
    }
  }

  renderMetricMethods() {
    return this.props.metrics.map((metric, i) => {
      return this.renderMetricMethod(metric, i);
    });
  }

  renderMetrics() {
    return (
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          In order to collect the chosen metrics, add the following calls to your application code. Import the NPM package <span className="monospace">hype-metrics</span> to access these methods.
        </li>
        <li className="list-group-item">
          <ul className="list-group list-group-flush">
            {this.renderMetricMethods()}
          </ul>
        </li>
        <li className="list-group-item text-muted">
          After adding these lines of code, create a branch of the application source code, apply the changes of your experiment and push them, then proceed.
        </li>
      </ul>
    );
  }

  renderEmpty() {
    return (
      <ul className="list-group list-group-flush">
        <li className="list-group-item text-muted">
          Choose metrics for the experiment to find out how to instrument the code.
        </li>
      </ul>
    );
  }

  render() {
    let metrics = this.props.metrics.length;
    return (
      <div className={"col-sm-6"}>
        <div className="card card-instrum">
          <h5 className="card-header text-center">
            Step 4: Instrumentation
          </h5>
          <div className="card-block card-block-instrum">
            {(metrics) ? this.renderMetrics() : this.renderEmpty()}
          </div>
        </div>
      </div>
    );
  }
}

export default Instrum;
