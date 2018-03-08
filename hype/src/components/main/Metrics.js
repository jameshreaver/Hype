import React, { Component } from 'react';
import { Line } from 'react-chartjs';

class Metrics extends Component {

  state = ({ "data":{
    labels: [],
    datasets: [
      {
        label: "master",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: []
      },
      {
        label: "browse_button",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: []
      }
    ]
  }});


  expdata = {
    "title":"Show Recent Reviews",
    "owner":"Frontend Developers",
    "target":"User Interface",
    "branch":"recent_reviews",
    "from":new Date("2018-02-24"),
    "to":new Date("2018-03-10"),
    "complete":40,
    "status":"Running"
  };

  getMetrics = async () => {
    let response = await fetch('/metrics');
    let body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  }

  updateMetrics = () => {
    let labels = [];
    let datasetA = [];
    let datasetB = [];
    this.getMetrics().then((metrics) => {
      for (let date = this.expdata["from"];
           date <= this.expdata["to"];
           date.setDate(date.getDate() + 1)) {
        labels.push(date.toLocaleDateString('en-GB'))
        if (date < new Date()) {
          let recordA = 0;
          let recordB = 0;
          for (let record of metrics) {
            if (new Date(record["data"]["timestamp"]).setHours(0,0,0,0) === date.setHours(0,0,0,0)) {
              if (record["version-id"] === "A001-master") {
                recordA++;
              } else {
                recordB++;
              }
            }
          }
          datasetA.push(recordA);
          datasetB.push(recordB);
        } else {
          datasetA.push(null);
          datasetB.push(null);
        }
      }
      console.log(labels);
      console.log(datasetA);
      console.log(datasetB);

      this.setState({ "data":{
        labels: labels,
        datasets: [
          {
            label: "master",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: datasetA
          },
          {
            label: "browse_button",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: datasetB
          }
        ]
      }});

    });
  };


  componentDidMount = () =>{
    //this.interval = setInterval(this.updateMetrics, 5000);
    this.updateMetrics();
  }

  componentWillUnmount = () =>{
    //clearInterval(this.interval);
  }

  render() {
    return (
      <div className="container-fluid">
        <h2>Metrics</h2>
        <div style={{maxwidth: "160px"}}>
          <Line data={this.state.data} options={{responsive: true, maintainAspectRatio: false}} width="100%" height="160px"/>
        </div>
        <section className="row text-center placeholders" style={{display: "none"}}>
          <div className="col-6 col-sm-3 placeholder">
            <img src="data:image/gif;base64,R0lGODlhAQABAIABAAJ12AAAACwAAAAAAQABAAACAkQBADs=" width="200" height="200" className="img-fluid rounded-circle" alt="Generic placeholder thumbnail"/>
            <h4>Label</h4>
            <div className="text-muted">Something else</div>
          </div>
          <div className="col-6 col-sm-3 placeholder">
            <img src="data:image/gif;base64,R0lGODlhAQABAIABAADcgwAAACwAAAAAAQABAAACAkQBADs=" width="200" height="200" className="img-fluid rounded-circle" alt="Generic placeholder thumbnail"/>
            <h4>Label</h4>
            <span className="text-muted">Something else</span>
          </div>
          <div className="col-6 col-sm-3 placeholder">
            <img src="data:image/gif;base64,R0lGODlhAQABAIABAAJ12AAAACwAAAAAAQABAAACAkQBADs=" width="200" height="200" className="img-fluid rounded-circle" alt="Generic placeholder thumbnail"/>
            <h4>Label</h4>
            <span className="text-muted">Something else</span>
          </div>
          <div className="col-6 col-sm-3 placeholder">
            <img src="data:image/gif;base64,R0lGODlhAQABAIABAADcgwAAACwAAAAAAQABAAACAkQBADs=" width="200" height="200" className="img-fluid rounded-circle" alt="Generic placeholder thumbnail"/>
            <h4>Label</h4>
            <span className="text-muted">Something else</span>
          </div>
        </section>
        <br/><br/><br/>
      </div>
    );
  }
}

export default Metrics;
