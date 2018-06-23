import React, { Component } from 'react';


class Hypothesis extends Component {

  initialState = {
    "change":"",
    "outcome":"",
    "validation":""
  };

  constructor(props) {
    super(props);
    if (Object.keys(props.experiment).length === 0) {
      this.state = this.initialState;
    } else {
      this.state = props.experiment.hypothesis;
    }
  }

  getInfo() {
    return this.state;
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
            Step 2: Hypothesis
            <button href="" className="btn badge badge-secondary main-tag pull-right">
              ?
            </button>
          </h5>
          <div className="card-block">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    We believe that...
                  </div>
                  <div className="col-sm-9">
                    <textarea className="form-control" name="change" rows="3" onChange={this.handleChange} value={this.state.change} placeholder="...this feature/capability"/>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    will result in...
                  </div>
                  <div className="col-sm-9">
                    <textarea className="form-control" name="outcome" rows="3" onChange={this.handleChange} value={this.state.outcome} placeholder="...this outcome/result"/>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    we will succeed if...
                  </div>
                  <div className="col-sm-9">
                    <textarea className="form-control" name="validation" rows="4"  onChange={this.handleChange} value={this.state.validation} placeholder="...these metrics are fulfilled."/>
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

export default Hypothesis;
