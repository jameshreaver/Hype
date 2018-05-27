import React, { Component } from 'react';
import { getServices } from '../../api/api';


class Info extends Component {

  initialState = {
    "title":"",
    "owner":"",
    "target":"",
    "duration":"",
    "durationunit":"",
    "service":"",
    "description":"",
    "services":[]
  };

  constructor(props) {
    super(props);
    if (Object.keys(props.experiment).length === 0) {
      this.state = this.initialState;
    } else {
      this.state = {...props.experiment.info,
        "services" : []
      }
    }
  }

  getInfo() {
    return {
      "title" : this.state.title,
      "owner" : this.state.owner,
      "target" : this.state.target,
      "duration" : this.state.duration,
      "durationunit" : this.state.durationunit,
      "service" : this.state.service,
      "description" : this.state.description
    }
  }

  componentDidMount() {
    getServices()
      .then(res => {
        this.setState({
          services: res.items.map((service) =>
            {return service.metadata.name})
        });
      })
      .catch(err =>
        console.log(err));
  }

  handleChange = (event) => {
    let target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  renderServices = () => {
    return this.state.services
      .map((service) => {
      return (
        <option key={service} value={service}>
          {service}
        </option>
    )});
  }


  render() {
    return (
      <div className="col-sm-6">
        <div className="card">
          <h5 className="card-header text-center">
            General Info
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
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
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
                    Service
                  </div>
                  <div className="col-sm-9">
                    <select className="form-control" name="exp-branch" value={this.state["exp-branch"]} onChange={this.handleChange}>
                      <option disabled></option>
                      {this.renderServices()}
                    </select>
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
