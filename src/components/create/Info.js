import React, { Component } from 'react';


class Info extends Component {

  initialState = {
    "title":"",
    "owner":"",
    "target":"",
    "duration":"",
    "durationunit":"",
    "description":""
  };

  constructor(props) {
    super(props);
    if (Object.keys(props.experiment).length === 0) {
      this.state = this.initialState;
    } else {
      this.state = props.experiment.info;
    }
  }

  getInfo() {
    return {
      "title" : this.state.title,
      "owner" : this.state.owner,
      "target" : this.state.target,
      "duration" : this.state.duration,
      "durationunit" : this.state.durationunit,
      "description" : this.state.description
    }
  }

  handleChange = (event) => {
    let target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  renderDuration = () => {
    return Array.from(new Array(10),(val,i) =>
      <option key={i+1} value={i+1}>
        {i+1}
      </option>
    );
  }

  render() {
    return (
      <div className="col-sm-6">
        <div className="card">
          <h5 className="card-header text-center">
            Step 1: General Info
            <button href="" className="btn badge badge-secondary main-tag pull-right">
              ?
            </button>
          </h5>
          <div className="card-block">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Title
                  </div>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" name="title" onChange={this.handleChange} value={this.state.title} placeholder="Brief title"/>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Owner
                  </div>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" name="owner" onChange={this.handleChange} value={this.state.owner} placeholder="Responsible team"/>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Duration
                  </div>
                  <div className="col-sm-3">
                    <select className="form-control" name="duration" onChange={this.handleChange} value={this.state.duration}>
                      <option disabled></option>
                      {this.renderDuration()}
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <select className="form-control" name="durationunit" onChange={this.handleChange} value={this.state.durationunit}>
                      <option disabled></option>
                      <option value="d">Days</option>
                      <option value="w">Weeks</option>
                      <option value="m">Months</option>
                    </select>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Target
                  </div>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" name="target" onChange={this.handleChange} value={this.state.target} placeholder="Concerned area"/>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Description
                  </div>
                  <div className="col-sm-9">
                    <textarea className="form-control" name="description" rows="3" onChange={this.handleChange} value={this.state.description} placeholder="Brief description"/>
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

export default Info;
