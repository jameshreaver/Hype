import React, { Component } from 'react';
import { getBranches } from '../../api/api';


class Settings extends Component {

  initialState = {
    "source":"",
    "main-branch":"-",
    "exp-branch":"-",
    "percentage": 50,
    "branches":[]
  };

  constructor(props) {
    super(props);
    if (Object.keys(props.experiment).length === 0) {
      this.state = this.initialState;
    } else {
      this.state = {...props.experiment.settings,
        "branches" : []
      }
    }
  }

  getInfo() {
    return {
      "source" : this.state.source,
      "main-branch" : this.state["main-branch"],
      "exp-branch" : this.state["exp-branch"]
    }
  }

  fetchBranches(source) {
    getBranches(source)
      .then(res => {
        this.setState({
          branches: res
        });
      })
      .catch(err =>
        console.log(err));
  }

  componentDidMount() {
    this.fetchBranches(this.state.source);
  }

  handleChange = (event) => {
    let target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  renderBranches = () => {
    return this.state.branches
      .map((branch) => {
      let sha = branch.commit.sha.substring(0, 7);
      return (
        <option key={sha} value={branch.name + '@' + sha}>
          {branch.name + " (" + sha + ")"}
        </option>
    )});
  }

  render() {
    return (
      <div className="col-sm-6">
        <div className="card">
          <h5 className="card-header text-center">
            Settings
            <button href="" className="btn badge badge-secondary main-tag pull-right">
              ?
            </button>
          </h5>
          <div className="card-block">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Repository
                  </div>
                  <div className="col-sm-9 input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">github.com/</div>
                    </div>
                    <input type="url" className="form-control" name="source" placeholder="username/repo-name" value={this.state.source} onChange={(e) => {this.handleChange(e); this.fetchBranches(e.target.value);}}/>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Main Branch
                  </div>
                  <div className="col-sm-9">
                    <select className="form-control" name="main-branch" value={this.state["main-branch"]} onChange={this.handleChange}>
                      {this.renderBranches()}
                    </select>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Experiment
                  </div>
                  <div className="col-sm-9">
                    <select className="form-control" name="exp-branch" value={this.state["exp-branch"]} onChange={this.handleChange}>
                      {this.renderBranches()}
                    </select>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <section className="">
                  <input type="range" className="form-control-range routing-bar" name="percentage" value={this.state.percentage} onChange={this.handleChange} min="0" max="100" step="1"/>
                </section>
                <section className="row">
                  <div className="col-sm-3 version-left">
                      <div className="card-subtext spaced">
                        Version A
                      </div>
                  </div>
                  <div className="col-sm-6 text-center">
                    <div className="text-center">
                      <span className="routing-percentages">
                        {100-this.state.percentage}%
                      </span>
                      <span className="routing-spaced"/>
                      <span className="routing-percentages">
                        {this.state.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-3 version-right">
                      <div className="card-subtext text-right spaced">
                        Version B
                      </div>
                  </div>
                </section>
                <div className="col-sm-12">
                    <div className="monospace pull-right">
                      {this.state["exp-branch"]}
                    </div>
                    <div className="monospace">
                      {this.state["main-branch"]}
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
                <i className={"fa sidebar-icon fa-check-circle"}/>
                <span className="font-weight-bold">{this.state["percentage"]}%</span> of traffic will be redirected to the experiment.
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
