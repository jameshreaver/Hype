import React, { Component } from 'react';

class Metrics extends Component {

  render() {
    return (
      <div className="col-sm-7">
        <div className="progress progress-main">
          <div className="progress-bar bg-info progress-bar-striped progress-bar-animated" role="progressbar" style={{width:"85%"}}>85%</div>
        </div>
        <h4 className="main-header">Metrics Overview<a href="" className="badge badge-secondary main-tag pull-right">Expand</a></h4>
        <div className="card">
          <div className="card-block">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    #1 Page Views
                  </div>
                  <div className="col-sm-9">
                    <div className="progress progress-metric">
                      <div className="progress-bar bg-success" role="progressbar" style={{width:"100%"}}>44,566/40,000</div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    #2 Click Rate
                  </div>
                  <div className="col-sm-9">
                    <div className="progress progress-metric">
                      <div className="progress-bar bg-warning" role="progressbar" style={{width:"70%"}}>0.56/0.8</div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    #3 Unique Visits
                  </div>
                  <div className="col-sm-9">
                    <div className="progress progress-metric">
                      <div className="progress-bar bg-warning" role="progressbar" style={{width:"38%"}}>3,810/10,000</div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    #4 Reviews Read
                  </div>
                  <div className="col-sm-9">
                    <div className="progress progress-metric">
                      <div className="progress-bar bg-warning" role="progressbar" style={{width:"74%"}}>1478/2000</div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    #5 Reviews Added
                  </div>
                  <div className="col-sm-9">
                    <div className="progress progress-metric">
                      <div className="progress-bar bg-warning" role="progressbar" style={{width:"24%"}}>48/200</div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Metrics;
