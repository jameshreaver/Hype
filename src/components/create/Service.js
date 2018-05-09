import React, { Component } from 'react';
import { getServices } from '../../api/api';


class Service extends Component {

  initialState = {
    "name":"",
    "image":"",
    "services":[]
  };

  constructor(props) {
    super(props);
    if (Object.keys(props.experiment).length === 0) {
      this.state = this.initialState;
    } else {
      this.state = {...props.experiment.service,
        "services" : []
      }
    }
  }

  getInfo() {
    return {
      "name" : this.state.name,
      "image" : this.state.image
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
            Service Details
            <button href="" className="btn badge badge-secondary main-tag pull-right">
              ?
            </button>
          </h5>
          <div className="card-block">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    Service
                  </div>
                  <div className="col-sm-9">
                    <select className="form-control" name="name" value={this.state.name} onChange={this.handleChange}>
                      {this.renderServices()}
                    </select>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3 card-subtext">
                    New Image
                  </div>
                  <div className="col-sm-9">
                    <input type="url" className="form-control" name="image" placeholder="e.g. gcr.io/project-name/image:tag" value={this.state.image} onChange={this.handleChange}/>
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

export default Service;
