import React, { Component } from 'react';

class Hypothesis extends Component {

  render() {
    let exp = this.props.experiment;
    return (
      <div className="col-sm-5">
        <div className="card">
          <h5 className="card-header text-center">
            Hypothesis
            <button href="" className="btn badge badge-secondary main-tag pull-right" onClick={this.props.toggleEdit}>
              Edit
            </button>
          </h5>
          <div className="card-block">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="card-subtext spaced">
                  We believe that...
                </div>
                <div>
                  {exp["hypothesis"]["change"]}
                </div>
              </li>
              <li className="list-group-item">
                <div className="card-subtext spaced">
                  Will result in...
                </div>
                <div>
                  {exp["hypothesis"]["outcome"]}
                </div>
              </li>
              <li className="list-group-item">
                <div className="card-subtext spaced">
                  We will succeed if...
                </div>
                <div className="font-italic">
                  {exp["hypothesis"]["validation"]}
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
