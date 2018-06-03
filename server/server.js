"use strict"

require('isomorphic-fetch');
const express = require('express');
const bodyParser = require('body-parser');
const database = require('nedb');
const runner = require('./runner');
const api = require('./api');

// import origins
const k8s = require('./origins/k8s');
const git = require('./origins/git');
const mcs = require('./origins/mcs');
const data= require('./origins/data');
const gapi= require('./origins/gapi');

const app = express();
const port = process.env.PORT || 5100;
app.use(bodyParser.json())
app.listen(port);
gapi.setupOAuth();

var db = new database({
  filename: './db/experiments.db',
  autoload: true
});


// AUTHENTICATE
app.get('/api/auth', (req, res) => {
  gapi.authenticate(req, res);
});

// GET /SERVICES
app.get('/api/k8s/services/', (req, res) => {
  k8s.getServices(req, res);
});

// GET /DEPLOYMENTS
app.get('/api/k8s/deployments/', (req, res) => {
  k8s.getDeployments(req, res);
});

// GET /BRANCHES
app.get('/api/git/branches/:owner/:repo', (req, res) => {
  git.getBranches(req, res);
});

// GET /METRICS
app.get('/api/metrics/:id', (req, res) => {
  mcs.getMetrics(req, res);
});

// GET /EXPERIMENTS
app.get('/api/data/experiments/', (req, res) => {
  data.getExperiments(req, res, db);
});

// GET /EXPERIMENT
app.get('/api/data/experiment/:id', (req, res) => {
  data.getExperiment(req, res, db);
});

// POST /EXPERIMENT
app.post('/api/data/experiment', (req, res) => {
  data.postExperiment(req, res, db);
});

// RUN /EXPERIMENT
app.get('/api/run/experiment/:id', (req, res) => {
  runner.runExperiment(req, res, db);
});

// END /EXPERIMENT
app.get('/api/end/experiment/:outcome/:id', (req, res) => {
  runner.endExperiment(req, res, db);
});

// MERGE /EXPERIMENT
app.get('/api/merge/experiment/:outcome/:id', (req, res) => {
  runner.mergeExperiment(req, res, db);
});
