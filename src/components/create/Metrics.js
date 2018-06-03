import React, { Component } from 'react';


class Info extends Component {

  initialState = {
    "metrics": []
  };

  constructor(props) {
    super(props);
    if (Object.keys(props.experiment).length === 0) {
      this.state = this.initialState;
    } else {
      this.state = {
        "metrics" : props.experiment.metrics
      };
    }
  }

  getInfo() {
    return this.state.metrics;
  }

  addMetric = () => {
    this.setState({
      "metrics": [...this.state.metrics, {
          "type":"",
          "elem":"",
          "key":false,
          "change":"",
          "value":0,
          "unit":""
        }]
      });
  }

  removeMetric = (index) => {
    this.state.metrics.splice(index, 1);
    this.setState({
      "metrics": this.state.metrics
    });
  }

  handleChange = (e, i) => {
    let target = e.target;
    this.setState({
      metrics: [
        ...this.state.metrics.slice(0, i),
        {...this.state.metrics[i],
          [target.name]: target.type === 'checkbox'
          ? target.checked
          : target.value
        },
        ...this.state.metrics.slice(i+1)
      ]});
  }

  renderMetrics = () => {
    let metrics = [];
    let ms = this.state.metrics;
    for (let i = 0; i < ms.length; i++) {
      metrics.push((
        <li className="list-group-item" key={i}>
          <div className="row">
            <div className="col-sm-2 card-subtext">
              <select className="form-control" name="type" value={ms[i].type} onChange={(e)=>{this.handleChange(e, i)}}>
                <option disabled></option>
                <option value="click">Click</option>
                <option value="pageview">Page view</option>
              </select>
            </div>
            <div className="col-sm-2 card-subtext">
              <input type="text" className="form-control" name="elem" value={ms[i].elem} onChange={(e)=>{this.handleChange(e,i)}} placeholder="Element ID"/>
            </div>
            <div className="col-sm-1 custom-control custom-checkbox">
              <input type="checkbox" className="create-checkbox" name="key" checked={ms[i].key} onChange={(e)=>{this.handleChange(e,i)}}/>
            </div>
            <div className="col-sm-2 card-subtext">
              <select className="form-control" name="change" value={ms[i].change} onChange={(e)=>{this.handleChange(e,i)}}>
                <option disabled></option>
                <option value="+">increase</option>
                <option value="<+">not increase</option>
                <option value="-">decrease</option>
                <option value=">-">not decrease</option>
              </select>
            </div>
            <div className="col-sm-2 card-subtext">
              <input type="number" className="form-control" name="value" min="0" value={ms[i].value} onChange={(e)=>{this.handleChange(e,i)}} placeholder="value"/>
            </div>
            <div className="col-sm-2 card-subtext">
              <select className="form-control" name="unit" value={ms[i].unit} onChange={(e)=>{this.handleChange(e,i)}}>
                <option disabled></option>
                <option value="percentage">% (percentage)</option>
                <option value="magnitude"># (magnitude)</option>
              </select>
            </div>
            <div className="col-sm-1">
              <button href="" className="btn badge badge-secondary main-tag pull-right" onClick={() => this.removeMetric(i)}>
                Remove
              </button>
            </div>
          </div>
        </li>));
    }
    return metrics;
  }

  render() {
    return (
      <div className="col-sm-12">
        <div className="card">
          <h5 className="card-header text-center">
            Metrics
            <button href="" className="btn badge badge-secondary main-tag pull-right" onClick={this.addMetric}>
              + Add
            </button>
          </h5>
          <div className="card-block">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-2 card-subtext">
                    Type
                  </div>
                  <div className="col-sm-2 card-subtext">
                    Element
                  </div>
                  <div className="col-sm-1   card-subtext">
                    Key
                  </div>
                  <div className="col-sm-2 card-subtext">
                    expected to
                  </div>
                  <div className="col-sm-2 card-subtext">
                    by more than
                  </div>
                  <div className="col-sm-2 card-subtext">
                    unit
                  </div>
                  <div className="col-sm-1 card-subtext">
                  </div>
                </div>
              </li>
              {this.renderMetrics()}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Info;
