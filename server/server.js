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
  getAPI(githubAPI + "repos/" + req.params.owner
  + "/" + req.params.repo + "/branches")
    .then(branches => {
      res.send(branches);
    }).catch(err => {
      console.log(err);
      res.send([]);
    });
});

// endExperiment(id)
app.get('/api/end/experiment/:outcome/:id', (req, res) => {
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
      endDeployments(info);
      // setExperimentPast(req.params.id, req.params.outcome, "ended");
      console.log("Ending experiment " + docs[0]["info"]["title"]);
  });
  res.end();
});

// mergeExperiment(id)
app.get('/api/merge/experiment/:outcome/:id', (req, res) => {
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
      mergeDeployments(info);
      // setExperimentPast(req.params.id, req.params.outcome, "merged");
      console.log("Merging experiment " + docs[0]["info"]["title"]);
  });
  res.end();
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
      //ensureAffinity(docs[0]["info"]["service"]);
      createDeployments(info);
      // createServices(service);
      // createRouter();
      // setExperimentRunning(req.params.id);
      console.log("Running experiment " + docs[0]["info"]["title"]);
  });
  res.end();
});

function setExperimentRunning(id) {
  let date = new Date().toJSON();
  expDB.update({id: id},{
    $set: {
     "status.type": "running",
     "time.started": date
    },
    $push: { "logs": {
     "date": date,
     "message": "started"
    }}}, {}, () => {});
  expDB.persistence.compactDatafile();
  console.log("Experiment set to \"running\"");
}

function setExperimentPast(id, outcome, action) {
  let date = new Date().toJSON();
  expDB.update({id: id}, {
    $set: {
       "status.type": "past",
       "status.outcome": outcome,
       "time.stopped": date
     },
     $push: { "logs": {
      "date": date,
      "message": action
     }}}, {}, () => {});
  expDB.persistence.compactDatafile();
  console.log("Experiment set to \"stopped\"");
}

function ensureAffinity(service) {
  let patch = {
    "spec" : {"sessionAffinity":"ClientIP"}
  };
  patchAPI(kubeHost + serviceAPI + service, patch)
    .then(res => {
      console.log("Ensure affinity for " + service);
    }).catch(err =>
      console.log(err));
}

function createDeployments(info) {
  let name = info["default-name"];
  getAPI(kubeHost + deployAPI + name)
    .then(config => {
      config.metadata.annotations = {};
      configDB.update({
        "metadata.name": config.metadata.name
      }, config, { upsert:true }, ()=>{
        let mainimage = name + "-" + info["main-branch"] + ":" + info["main-sha"];
        let expimage = name + "-" + info["exp-branch"] + ":" + info["exp-sha"];
        createDeployment(name + "-" + info["main-branch"], mainimage, 10-info["replicas"], config);
        createDeployment(name + "-" + info["exp-branch"], expimage, info["replicas"], config);
        deleteDeployment(name);
        configDB.persistence.compactDatafile();
      });
    }).catch(err =>
      console.log(err));
}

function endDeployments(info) {
  let name = info["default-name"];
  configDB.findOne({"metadata.name": name}, {_id: 0}).exec(function (err, config) {
    let image = name + "-" + info["main-branch"] + ":" + info["main-sha"];
    createDeployment(name, image, 1, config);
    deleteDeployment(name + "-" + info["main-branch"]);
    deleteDeployment(name + "-" + info["exp-branch"]);
  });
}

function mergeDeployments(info) {
  let name = info["default-name"];
  configDB.findOne({"metadata.name": name}, {_id: 0}).exec(function (err, config) {
    let image = name + "-" + info["exp-branch"] + ":" + info["exp-sha"];
    createDeployment(name, image, 1, config);
    deleteDeployment(name + "-" + info["main-branch"]);
    deleteDeployment(name + "-" + info["exp-branch"]);
  });
}

function createDeployment(name, image, replicas, config) {
  let deployConfig = Object.assign({}, config);
  deployConfig.metadata.name = name;
  deployConfig.metadata.resourceVersion = '';
  deployConfig.spec.replicas = replicas;
  deployConfig.spec.template.spec.containers[0].image = registryURL + image;
  deployConfig.spec.template.spec.containers[0].imagePullPolicy = "Always";
  postAPI(kubeHost + deployAPI, deployConfig)
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
  expDB.update({ id: req.body.id }, req.body, {
    upsert:true
  }, (e, n, a, upsert)=>{
    expDB.update({ id: req.body.id }, {
      $push: { "logs": {
        "date": new Date().toJSON(),
        "message": (upsert) ? "created" : "edited"
    }}}, {}, ()=>{});
  });

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
