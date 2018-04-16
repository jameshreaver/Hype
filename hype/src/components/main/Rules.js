import React, { Component } from 'react';

class Rules extends Component {

  render() {
    let exp = this.props.experiment;
    return (
      <div className="col-sm-7">
        <div className="card">
          <h5 className="card-header text-center">
            Routing Rules
            <button href="" className="btn badge badge-secondary main-tag pull-right" onClick={this.props.toggleEdit}>
              Edit
            </button>
          </h5>
          <div className="card-block">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <section className="row">
                  <div className="col-sm-4 version-left">
                      <div className="card-subtext spaced">
                        Version A
                      </div>
                  </div>
                  <div className="col-sm-4 text-center">
                    <div className="text-center">
                      <span className="routing-percentages">
                        {100-exp["rules"]["percentage"]}%
                      </span>
                      <span className="routing-spaced"/>
                      <span className="routing-percentages">
                        {exp["rules"]["percentage"]}%
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-4 version-right">
                      <div className="card-subtext text-right spaced">
                        Version B
                      </div>
                  </div>
                </section>
                <div className="col-sm-12">
                    <div className="monospace pull-right">
                      {exp["versions"]["experimentbranch"]}
                    </div>
                    <div className="monospace">
                      {exp["versions"]["masterbranch"]}
                    </div>
                </div>
                <section className="row">
                  <div className="col-sm-12 routing-icon">
                    <div className="card-subtext text-center spaced">
                      <i className="fa fa-long-arrow-left routing-arrow-left fa-3x"></i>
                      <span className="fa-stack fa-2x">
                        <i className="fa fa-arrows fa-stack-1x"></i>
                        <i className="fa fa-circle-thin fa-stack-2x"></i>
                      </span>
                      <i className="fa fa-long-arrow-right routing-arrow-right fa-3x"></i>
                    </div>
                  </div>
                </section>
              </li>
              <li className="list-group-item">
                <div>
                  <ul className="routing-rules">
                    <li>
                      <i className={"fa sidebar-icon fa-check-circle"}/>
                      Currently <span className="font-weight-bold">{exp["rules"]["percentage"]}%</span> of traffic is being redirected to version B.
                    </li>
                    <li>
                      <i className={"fa sidebar-icon fa-times-circle"}/>
                      Traffic is <span className="font-weight-bold">not</span> being redirected by user agent.
                    </li>
                    <li>
                      <i className={"fa sidebar-icon fa-times-circle"}/>
                      Traffic is <span className="font-weight-bold">not</span> being redirected by being logged In.
                    </li>
                    <li>
                      <i className={"fa sidebar-icon fa-times-circle"}/>
                      Traffic is <span className="font-weight-bold">not</span> being redirected by IP address.
                    </li>
                    <li>
                      <i className={"fa sidebar-icon fa-times-circle"}/>
                      Traffic is <span className="font-weight-bold">not</span> being redirected by being a returning user.
                    </li>
                    <li>
                      <i className={"fa sidebar-icon fa-times-circle"}/>
                      Traffic is <span className="font-weight-bold">not</span> being redirected by custom parameters.
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Rules;
