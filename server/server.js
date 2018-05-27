"use strict"

const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
require('isomorphic-fetch');

const app = express();
const port = process.env.PORT || 5100;
app.use(bodyParser.json())

let kubeHost = "http://localhost:5200/";
let metricsHost = "http://localhost:4888/";
let serviceAPI = "/api/v1/namespaces/default/services/"
let deployAPI = "/apis/apps/v1beta1/namespaces/default/deployments/"
let githubAPI = "https://api.github.com/";
let registryURL = "gcr.io/booksnap-h/";

var Datastore = require('nedb')
var expDB = new Datastore({
  filename: './db/experiments.db',
  autoload: true
});

var configDB = new Datastore({
  filename: './db/configurations.db',
  autoload: true
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});

async function getAPI (path) {
  let response = await fetch(path);
  let body = await response.json();
  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}

async function postAPI (path, data) {
  await fetch(path, {
    method: 'post',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

async function patchAPI (path, data) {
  await fetch(path, {
    method: 'patch',
    headers: {
      "Content-type": "application/merge-patch+json"
    },
    body: JSON.stringify(data)
  });
}

async function deleteAPI (path) {
  await fetch(path, {
    method: 'delete',
    headers: {
      "Content-type": "application/json"
    },
  });
}

// getServices()
app.get('/api/k8s/services/', (req, res) => {
  getAPI(kubeHost + serviceAPI)
    .then(services => {
      res.send(services);
    }).catch(err =>
      console.log(err));
});

// getDeployments()
app.get('/api/k8s/deployments/', (req, res) => {
  getAPI(kubeHost + deployAPI)
    .then(deployments => {
      res.send(deployments);
    }).catch(err =>
      console.log(err));
});

// getBranches()
app.get('/api/git/branches/:owner/:repo', (req, res) => {
  //res.send([{"name":"browse-button","commit":{"sha":"dec988c"}},{"name":"master","commit":{"sha":"1015cdb"}}]);
  getAPI(githubAPI + "repos/" + req.params.owner
  + "/" + req.params.repo + "/branches")
    .then(branches => {
      res.send(branches);
    }).catch(err => {
      console.log(err);
      res.send([]);
    });
});

// runExperiment(id)
app.get('/api/run/experiment/:id', (req, res) => {
  expDB.find({id: req.params.id}, {})
    .limit(1).exec(function (err, docs) {
      let settings = docs[0]["settings"];
      let info = {
        "default-name": settings["source"].split("/")[1],
        "main-branch": settings["main-branch"].split("@")[0],
        "main-sha": settings["main-branch"].split("@")[1],
        "exp-branch": settings["exp-branch"].split("@")[0],
        "exp-sha": settings["exp-branch"].split("@")[1],
        "replicas": parseInt(settings["percentage"])/10
      };
      console.log(info);
      patchService(docs[0]["info"]["service"]);
      createDeployments(info);
      // createServices(service);
      // createRouter();
      // updateExperimentDB(req.params.id);
      console.log("Running experiment " + docs[0]["info"]["title"]);
  });
  res.end();
});

function updateExperimentDB(id) {
  expDB.update({id: id},
   { $set: {
     "status.type": "running",
     "time.started": new Date().toJSON()
   } }, {}, () => {});
  expDB.persistence.compactDatafile();
  console.log("Updated experiment records");
}

function patchService(service) {
  let patch = {
    "spec" : {"sessionAffinity":"ClientIP"}
  };
  patchAPI(kubeHost + serviceAPI + service, patch)
    .then(res => {
      console.log("Patched Service " + service);
    }).catch(err =>
      console.log(err));
}

function createDeployments(info) {
  let name = info["default-name"];
  getAPI(kubeHost + deployAPI + name)
    .then(config => {
      configDB.update({
        "metadata.name": config.metadata.name
      }, config, { upsert:true }, ()=>{});
      configDB.persistence.compactDatafile();
      createDeployment(name + "-" + info["main-branch"], info["main-sha"], info["replicas"], config);
      createDeployment(name + "-" + info["exp-branch"], info["exp-sha"], 10-info["replicas"], config);
      deleteDeployment(name);
    }).catch(err =>
      console.log(err));
}

function createDeployment(name, sha, replicas, config) {
  config.metadata.name = name;
  config.metadata.resourceVersion = '';
  config.spec.replicas = replicas;
  config.spec.template.spec.containers[0].image = registryURL + name + ':' + sha;
  config.spec.template.spec.containers[0].imagePullPolicy = "Always";
  postAPI(kubeHost + deployAPI, config)
    .then(res => {
      console.log("Created Deployment " + name);
    }).catch(err =>
      console.log(err));
}

function deleteDeployment(name) {
  deleteAPI(kubeHost + deployAPI + name)
    .then(res => {
      console.log("Deleted Deployment " + name);
    }).catch(err =>
      console.log(err));
}

// getMetrics(id)
app.get('/api/metrics/:id', (req, res) => {
  getAPI(metricsHost + req.params.id)
    .then(metrics => {
      res.send(metrics);
    }).catch(err => {
      console.log(err);
      res.send([]);
  });
});

// getExperiment(id)
app.get('/api/data/experiment/:id', (req, res) => {
  expDB.find({id: req.params.id}, {
    _id: 0
  }).limit(1).exec(function (err, docs) {
    res.send(docs);
  });
});

// postExperiment(exp)
app.post('/api/data/experiment', (req, res) => {
  expDB.update({ id: req.body.id }, req.body, { upsert:true }, ()=>{});
  expDB.persistence.compactDatafile();
  res.end();
});

// getExperiments()
app.get('/api/data/experiments/', (req, res) => {
  expDB.find({}, {
    id: 1,
    "info.title": 1,
    "info.duration": 1,
    "info.durationunit": 1,
    status: 1,
    "time.started": 1,
    _id: 0
  })
  .sort({ "time.added": 1 })
  .exec(function (err, docs) {
    res.send(docs);
  });
});
