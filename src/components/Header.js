import React, { Component } from 'react';

class Header extends Component {

  data = {
    "app-name": "BookSnap"
  }

  render() {
    return (
      <header>
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <a className="navbar-brand" href="/">
            <i className="fa fa-universal-access fa-spin fa-fw"></i> <strong>Hype</strong> for {this.data["app-name"]}
          </a>
          <button className="navbar-toggler d-lg-none" type="button">
          <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto navbar-txt">
              <li className="nav-item active">
                <a className="nav-link" href="/">Dashboard</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/profile">Profile</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/settings">Settings</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/help">Help</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about">About</a>
              </li>
            </ul>
            <form className="form-inline mt-2 mt-md-0">
              <input className="form-control mr-sm-2" type="text" placeholder="Search"/>
              <button className="btn btn-light my-2 my-sm-0" type="submit">Go</button>
            </form>
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;
