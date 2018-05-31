import React, { Component } from 'react';
import Sidebar from './Sidebar';
import Main from './Main';
import Create from './Create';
import Landing from './Landing';
import { getExperiment } from '../api/api';


class Body extends Component {

  constructor(props) {
    super(props)
    this.select =
      this.select.bind(this);
    this.toggleCreate =
      this.toggleCreate.bind(this);
    this.toggleEdit =
      this.toggleEdit.bind(this);
    this.state = {
      experiment: {},
      editing: false,
      selected: ""
    };
  }

  select(id) {
    getExperiment(id)
      .then(res => {
        this.setState({
          experiment: res,
          selected: id,
          editing: false,
        });
      })
      .catch(err =>
        console.log(err));
  }

  toggleCreate() {
    this.setState({
      experiment:{},
      selected:"",
      editing:!this.state.editing
    });
  }

  toggleEdit() {
    this.setState({
      editing:!this.state.editing
    });
  }

  render() {
    let main = <Landing/>;
    if (this.state.editing) {
      main = <Create experiment={this.state.experiment}/>;
    } else if (this.state.selected) {
      main = <Main experiment={this.state.experiment} toggleEdit={this.toggleEdit}/>;
    }
    return (
      <div className="container-fluid">
        <div className="row">
          <Sidebar info={this.state}
            select={this.select}
            toggleCreate={this.toggleCreate}/>
          {main}
        </div>
      </div>
    );
  }
}

export default Body;
