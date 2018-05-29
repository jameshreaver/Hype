import React, { Component } from 'react';
import { Line } from 'react-chartjs';
import { renderUnit } from '../../util/utils';


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

  renderMetric(m, data, i) {
    let unit = renderUnit(m["unit"]);
    let graphData = this.getGraphData(
      data["labels"], data["datasetA"], data["datasetB"]);
    return (
      <div key={i}>
        <p>
          <i className={"fa metrics-icon " + ((data["status"]) ? "fa-check-circle success" : "fa-minus-circle")}/>
          Number of <strong>{m["type"]+"s"}</strong> on element "<a className="monospace">{m["elem"]}</a>".
          <button href="" className="btn badge badge-secondary main-tag pull-right" onClick={this.props.toggleEdit}>
            Edit
          </button>
        </p>
        <div className="metric">
         <section className="row">
            <div className="col-sm-3">
              <div className="card-subtext">
                Total {m["type"]+"s"} (version A): {data["totalA"]}
              </div>
              <div className="card-subtext">
                Total {m["type"]+"s"} (version B): {data["totalB"]}
              </div>
            </div>
            <div className="col-sm-2">
              <div className="card-subtext">
                Current change:
              </div>
              <div className="">
                {data["value"]+unit}
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
          <div style={{"maxHeight": "160px"}}>
            <Line data={graphData} options={{responsive: true, maintainAspectRatio: false}} width="100%" height="160px"/>
          </div>
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
