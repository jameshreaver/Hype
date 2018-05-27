import React, { Component } from 'react';
import { Line } from 'react-chartjs';
import { getMetrics } from '../../api/api';

class Metrics extends Component {

  state = {
    metrics: []
  };

  componentDidMount = () =>{
    this.updateMetrics();
    this.interval = setInterval(() => {
      this.updateMetrics()
    }, 5000);
  }

  componentWillUnmount = () =>{
    clearInterval(this.interval);
  }

  componentWillReceiveProps = (next) => {
    this.updateMetrics(next.experiment["id"]);
  }

  updateMetrics(id = this.props.experiment["id"]) {
    getMetrics(id)
      .then(metrics => {
        this.setState({
          metrics: metrics
        });
      }).catch(err =>
        console.log(err));
  }

  getGraphData(labels, datasetA, datasetB) {
    return {
      labels: labels,
      datasets: [{
        label: "master",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: datasetA
      }, {
        label: "browse_button",
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

  processMetric(m) {
    let exp = this.props.experiment;
    let metrics = this.state.metrics;
    let metric = metrics.find((metric) => {
      return metric["type"] === m["type"]
        && metric["elem"] ===m["elem"];
    });
    if (!metric) {
      return {
        totalA: "-",
        totalB: "-",
        change: "-",
        data: this.getGraphData([], [], [])
      }
    }
    let labels = [];
    let datasetA = [];
    let datasetB = [];
    for (let date = new Date(exp["time"]["started"]);
      date <= new Date().setDate(new Date().getDate() + 1);
      date.setDate(date.getDate()+1)) {
      let label = date.toLocaleDateString('en-US');
      labels.push(label);
      if (metric.data[label]) {
        let datum = metric.data[label][exp["settings"]["main-branch"]];
        datasetA.push((datum) ? datum : 0);
        datum = metric.data[label][exp["settings"]["exp-branch"]];
        datasetB.push((datum) ? datum : 0);
      } else {
        datasetA.push(0);
        datasetB.push(0);
      }
    }
    let totalA = datasetA.reduce((x, y) => x + y, 0);
    let totalB = datasetB.reduce((x, y) => x + y, 0);
    return {
      totalA: totalA,
      totalB: totalB,
      change: ((totalB - totalA)*100/totalA).toFixed(2),
      data: this.getGraphData(labels, datasetA, datasetB)
    }
  }

  renderUnit(unit) {
    switch (unit) {
      case "percentage": return "%";
      case "magnitude": return "";
      default: return "";
    }
  }

  getMetricStatus(change, expected, current) {
    if (current === "-") return false;
    switch (change) {
      case "+" : return current >= expected;
      case "-" : return current <= -expected;
      case ">-": return current >= -expected;
      case "<+": return current <= expected;
      default: return false;
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

  renderMetric(m, i) {
    let processed = this.processMetric(m);
    let unit = this.renderUnit(m["unit"]);
    let status = this.getMetricStatus(
      m["change"], m["value"], processed["change"]);
    return (
      <div key={i}>
        <p>
          <i className={"fa metrics-icon " + ((status) ? "fa-check-circle success" : "fa-minus-circle")}/>
          Number of <strong>{m["type"]+"s"}</strong> on element "<a className="monospace">{m["elem"]}</a>".
          <button href="" className="btn badge badge-secondary main-tag pull-right" onClick={this.props.toggleEdit}>
            Edit
          </button>
        </p>
        <div className="metric">
         <section className="row">
            <div className="col-sm-3">
              <div className="card-subtext">
                Total {m["type"]+"s"} (version A): {processed["totalA"]}
              </div>
              <div className="card-subtext">
                Total {m["type"]+"s"} (version B): {processed["totalB"]}
              </div>
            </div>
            <div className="col-sm-2">
              <div className="card-subtext">
                Current change:
              </div>
              <div className="">
                {processed["change"]+unit}
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
              {this.renderMetricStatus(status)}
            </div>
          </section>
          <div style={{"maxHeight": "160px"}}>
            <Line data={processed["data"]} options={{responsive: true, maintainAspectRatio: false}} width="100%" height="160px"/>
          </div>
        </div>
      </div>
    );
  }

  renderMetrics() {
    let metrics = [];
    let ms = this.props.experiment["metrics"];
    if (!ms.length) return "No metrics for this experiment.";
    for (let [i, metric] of ms.entries()) {
      metrics.push(this.renderMetric(metric, i));
    }
    return metrics;
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
