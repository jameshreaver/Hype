import React, { Component } from 'react';


class Rules extends Component {

  initialState = {
    "percentage":50
  };

  constructor(props) {
    super(props);
    if (Object.keys(props.experiment).length === 0) {
      this.state = this.initialState;
    } else {
      this.state = props.experiment.rules;
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
            Routing Rules
            <button href="" className="btn badge badge-secondary main-tag pull-right">
              ?
            </button>
          </h5>
          <div className="card-block">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="text-center">
                  {this.state.percentage}%
                </div>
                <div className="row">
                  <div className="col-sm-1 card-subtext">
                    a
                  </div>
                  <div className="col-sm-10">
                    <input type="range" className="form-control-range" name="percentage" value={this.state.percentage} onChange={this.handleChange} min="0" max="100" step="1"/>
                  </div>
                  <div className="col-sm-1 card-subtext">
                    b
                  </div>
                </div>
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

export default Rules;
