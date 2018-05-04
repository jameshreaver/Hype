import React, { Component } from 'react';


class Rules extends Component {

  initialState = {
    "percentage":50,
    "useragent":{
      "on":false,
      "pred":"",
      "value":""
    },
    "visitor":{
      "on":false,
      "pred":"",
      "value":""
    },
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

  handleChangeUserAgent = (event) => {
    let target = event.target;
    this.setState({
      useragent: {...this.state.useragent,
        [target.name]: target.type === 'checkbox'
        ? target.checked
        : target.value
    }});
  }

  handleChangeVisitor = (event) => {
    let target = event.target;
    this.setState({
      visitor: {...this.state.visitor,
        [target.name]: target.type === 'checkbox'
        ? target.checked
        : target.value
    }});
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
                <div className="row">
                  <div className="col-sm-1">
                    <input type="checkbox" className="" name="on" onChange={this.handleChangeUserAgent} checked={this.state.useragent.on}/>
                  </div>
                  <div className="col-sm-3 card-subtext">
                    User Agent
                  </div>
                  <div className="col-sm-3">
                    <select className="form-control" name="pred" onChange={this.handleChangeUserAgent} value={this.state.useragent.pred}>
                      <option value="is">is</option>
                      <option value="is not">is not</option>
                    </select>
                  </div>
                  <div className="col-sm-5">
                    <select className="form-control" name="value" onChange={this.handleChangeUserAgent} value={this.state.useragent.value}>
                      <option value="Google Chrome">Google Chrome</option>
                      <option value="Internet Explorer">Internet Explorer</option>
                      <option value="Safari">Safari</option>
                      <option value="Mozilla Firefox">Mozilla Firefox</option>
                    </select>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-1">
                    <input type="checkbox" className="" name="on" onChange={this.handleChangeVisitor} checked={this.state.visitor.on}/>
                  </div>
                  <div className="col-sm-3 card-subtext">
                    Visitor
                  </div>
                  <div className="col-sm-3">
                    <select className="form-control" name="pred" onChange={this.handleChangeVisitor} value={this.state.visitor.pred}>
                      <option value="is">is</option>
                      <option value="is not">is not</option>
                    </select>
                  </div>
                  <div className="col-sm-5">
                    <select className="form-control" name="value" onChange={this.handleChangeVisitor} value={this.state.visitor.value}>
                      <option value="logged in">logged in</option>
                      <option value="returning">returning</option>
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

export default Rules;
