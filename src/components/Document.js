import React, { Component } from 'react';
import Header from './Header';
import Body from './Body';
import { getApplication } from '../api/api';


class Document extends Component {

  state = {
    app : ""
  }

  componentWillMount() {
    getApplication()
      .then(res => {
        this.setState({
          app: res.app
      })}).catch(err =>
        console.log(err));
  }

  render() {
    return (
      <div>
        <Header app={this.state.app}/>
        <Body app={this.state.app}/>
      </div>
    );
  }
}

export default Document;
