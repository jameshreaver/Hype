import React, { Component } from 'react';


class Landing extends Component {

  render() {
    return (
      <main role="main" className="col-sm-9 ml-sm-auto col-md-10 pt-3">
        <h1 className="center">Welcome to Hype</h1>
        <div className="jumbotron">
          <h1 className="display-4">Let us make {this.props.app} better.</h1>
          <p className="lead">Hype has been installed successfully.</p>
          <hr className="my-4"/>
          <p>Begin by setting up a new feature experiment or select an exiting experiment the sidebar. Your experiments are divided in three categories.<br/> "Planned Experiments" which are ready to run, "Running Experiments" and "Past Experiments", which have run either successfully or unsuccessfully.</p>
        </div>
        <section className="row">
          <div className="col-sm-6">
            <div className="jumbotron">
              <h5>Using Hype for {this.props.app}</h5>
              <p className="lead">Hype is a framework to run fast-paced feature experiments on your web application and validate them with tangible metrics.</p>
              <hr className="my-4"/>
              <section className="row">
                <div className="col-sm-6">
                  <a href="/">Profile</a><br/>
                  Manage the current Hype profile.
                </div>
                <div className="col-sm-6">
                  <a href="/">Help</a><br/>
                  Access the full resources to help you.
                </div>
              </section>
              <br/>
              <section className="row">
                <div className="col-sm-6">
                  <a href="/">Settings</a><br/>
                  Edit the Hype configurations.
                </div>
                <div className="col-sm-6">
                  <a href="/">About</a><br/>
                  Abotu Hype and how it came to life.
                </div>
              </section>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="jumbotron">
              <h5>Hypothesis Driven Development</h5>
              <p className="lead">is a recent methodology for software development which ensures that changes are provably capable of adding value.</p>
              <hr className="my-4"/>
              <p>To find out more about Hypothesis Driven Development and continuous experimentation, you can find out more by reading a recent paper.</p>
              <p className="lead">
                <button className="btn btn-light btn-lg">Learn more</button>
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default Landing;
