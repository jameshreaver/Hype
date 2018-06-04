import React, { Component } from 'react';
import { Line } from 'react-chartjs';
import * as render from '../../util/render';


class Metrics extends Component {

  getGraphData(labels, datasetA, datasetB) {
    let exp = this.props.experiment;
    return {
      labels: labels,
      datasets: [{
        label: exp["settings"]["main-branch"],
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: datasetA
      }, {
        label: exp["settings"]["exp-branch"],
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: datasetB
      }]
    }
  }

  renderGraph(data) {
    if (!data["labels"].length) {
      return;
    };
    let graphData = this.getGraphData(
      data["labels"],
      data["datasetA"],
      data["datasetB"]
    );
    return (
      <div className="metrics-graph">
        <Line className="metrics-line"
         data={graphData}
         options={{
          responsive: true,
          maintainAspectRatio: false
        }}/>
      </div>
    );
  }

  renderMetricStatus(status) {
    return (status) ? (
      <div className="metrics-fulfilled">
        <i className="fa metrics-icon fa-check-circle success"/>
        Fulfilled
      </div>
    ) : (
      <div>Unfulfilled</div>
    )
  }

  renderWeighted(value) {
    return (value === "-") ? "" : "(" + value.toFixed(2) + ")";
  }

  renderTotal(value) {
    return (value === "-") ? value : value.toFixed(2);
  }

  renderMetric(m, data, i) {
    let unit = render.renderUnit(m["unit"]);
    let type = render.renderType(m["type"]);
    return (
      <div key={i}>
        <p>
          <i className={"fa metrics-icon " + ((data["status"]) ? "fa-check-circle success" : "fa-minus-circle")}/>
          <strong>{type}</strong> on element "<a className="monospace">{m["elem"]}</a>".
          <button href="" className="btn badge badge-secondary main-tag pull-right" onClick={this.props.toggleEdit}>
            Edit
          </button>
        </p>
        <div className="metric">
         <section className="row">
            <div className="col-sm-3">
              <div className="card-subtext">
                Total {type} (version A): {this.renderTotal(data["totalA"])}
                {" "+this.renderWeighted(data["weightedA"])}
              </div>
              <div className="card-subtext">
                Total {type} (version B): {this.renderTotal(data["totalB"])}
                {" "+this.renderWeighted(data["weightedB"])}
              </div>
            </div>
            <div className="col-sm-2">
              <div className="card-subtext">
                Current change:
              </div>
              <div className="">
                {render.renderValue(data["value"], unit)}
              </div>
            </div>
            <div className="col-sm-2">
              <div className="card-subtext">
                Expected change:
              </div>
              <div className="">
                {m["change"]+m["value"]+unit}
              </div>
            </div>
            <div className="col-sm-5">
              <div className="card-subtext">
                Metric Status:
              </div>
              {this.renderMetricStatus(data["status"])}
            </div>
          </section>
          {this.renderGraph(data)}
        </div>
      </div>
    );
  }

  renderMetrics() {
    let data = this.props.metrics;
    let ms = this.props.experiment["metrics"];
    if (!ms.length) return "No metrics for this experiment.";
    return ms.map((m, i) => {
      return this.renderMetric(m, data[i], i)
    });
  }

  render() {
    return (
      <div className="container-fluid">
        {this.renderMetrics()}
        <br/>
      </div>
    );
  }
}

export default Metrics;
