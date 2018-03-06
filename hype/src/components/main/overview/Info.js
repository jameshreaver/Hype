import React, { Component } from 'react';

class Info extends Component {

  data = {
    "experiment": {
      "title":"Show Recent Reviews",
      "owner":"Frontend Developers",
      "target":"User Interface",
      "branch":"recent_reviews",
      "from":new Date("2018-03-10"),
      "to":new Date("2018-03-24"),
      "complete":40,
      "status":"Running"
    }
  }

  render() {
    return (
      <div className="col-sm-5">
        <div className="card">
          <h5 className="card-header text-center">
            Experiment Info
            <a href="" className="badge badge-secondary main-tag pull-right">
              Edit
            </a>
          </h5>
          <div className="card-block">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Title
                  </div>
                  <div className="col-sm-9">
                    {this.data["experiment"]["title"]}
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Owner
                  </div>
                  <div className="col-sm-9">
                    {this.data["experiment"]["owner"]}
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Target
                  </div>
                  <div className="col-sm-9">
                    {this.data["experiment"]["target"]}
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="row">
                      <div className="col-sm-6 card-subtext">
                        From
                      </div>
                      <div className="col-sm-6">
                        {this.data["experiment"]["from"].toLocaleDateString('en-GB')}
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="row">
                      <div className="col-sm-3 card-subtext">
                        to
                      </div>
                      <div className="col-sm-9">
                        {this.data["experiment"]["to"].toLocaleDateString('en-GB')}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Branch
                  </div>
                  <div className="col-sm-9 monospace">
                    {this.data["experiment"]["branch"]}
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="card-footer">
            <div className="row">
              <div className="col-sm-3 card-subtext">
                Status
              </div>
              <div className="col-sm-9 card-status running">
                <i className="fa fa-circle-o-notch fa-spin fa-fw"/>
                {this.data["experiment"]["status"]}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Info;
