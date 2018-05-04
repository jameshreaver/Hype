import React, { Component } from 'react';


class Versions extends Component {

  initialState = {
    "repo":"",
    "masterbranch":"",
    "experimentbranch":""
  };

  constructor(props) {
    super(props);
    if (Object.keys(props.experiment).length === 0) {
      this.state = this.initialState;
    } else {
      this.state = props.experiment.versions;
    }
  }

  handleChange = (event) => {
    let target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  render() {
    return (
      <div className="col-sm-6">
        <div className="card">
          <h5 className="card-header text-center">
            Versions
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
                  <div className="col-sm-9">
                    <input type="url" className="form-control" name="repo" placeholder="Git repository URL" value={this.state.repo} onChange={this.handleChange}/>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Main Branch
                  </div>
                  <div className="col-sm-9">
                    <select className="form-control" name="masterbranch" value={this.state.masterbranch} onChange={this.handleChange}>
                      <option value="master (d8329fc)">master (d8329fc)</option>
                      <option value="recent_reviews (4e65cc7)">recent_reviews (4e65cc7)</option>
                    </select>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Experiment Branch
                  </div>
                  <div className="col-sm-9">
                    <select className="form-control" name="experimentbranch" value={this.state.experimentbranch} onChange={this.handleChange}>
                      <option value="recent_reviews (4e65cc7)">recent_reviews (4e65cc7)</option>
                      <option value="master (d8329fc)">master (d8329fc)</option>
                    </select>
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

export default Versions;
