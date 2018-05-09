"use strict"

const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
require('isomorphic-fetch');

const app = express();
const port = process.env.PORT || 5100;
app.use(bodyParser.json())

let kubeHost = "http://localhost:5200/";
let serviceAPI = "/api/v1/namespaces/default/services/"
let deployAPI = "/apis/apps/v1beta1/namespaces/default/deployments/"

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
  let response = await fetch(kubeHost + path);
  let body = await response.json();
  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}

async function postAPI (path, data) {
  await fetch(kubeHost + path, {
    method: 'post',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

async function deleteAPI (path) {
  await fetch(kubeHost + path, {
    method: 'delete',
    headers: {
      "Content-type": "application/json"
    },
  });
}

// getServices()
app.get('/api/k8s/services/', (req, res) => {
  getAPI(serviceAPI)
    .then(services => {
      res.send(services);
    }).catch(err =>
      console.log(err));
});

// runExperiment(id)
app.get('/api/run/experiment/:id', (req, res) => {
  expDB.find({id: req.params.id}, {})
    .limit(1).exec(function (err, docs) {
      let service = docs[0]["service"];
      createDeployments(service);
      //createServices(service);
      //createRouter();
      expDB.update({id: req.params.id},
        { $set: {
          "status.type": "running",
          "time.started": new Date().toJSON()
        } }, {}, () => {});
      expDB.persistence.compactDatafile();
      console.log("Running experiment " +
        docs[0]["info"]["title"]);
      res.end();
  });
});

function createDeployments(service) {
  let name = service["name"];
  getAPI(deployAPI + name)
    .then(config => {
      configDB.update({
        "metadata.name": config.metadata.name
      }, config, { upsert:true }, ()=>{});
      configDB.persistence.compactDatafile();
      let image = config.spec.template.spec.containers[0].image;
      createDeployment(name + "-a", config, image);
      createDeployment(name + "-b", config, service["image"]);
      deleteDeployment(name);
    }).catch(err =>
      console.log(err));
}

function createDeployment(name, config, image) {
  config.metadata.name = name;
  config.metadata.resourceVersion = '';
  config.spec.template.spec.containers[0].image = image;
  postAPI(deployAPI, config)
    .then(res => {
      console.log("Created Deployment " + name);
    }).catch(err =>
      console.log(err));
}

function deleteDeployment(name) {
  deleteAPI(deployAPI + name)
    .then(res => {
      console.log("Deleted Deployment " + name);
    }).catch(err =>
      console.log(err));
}

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

app.post('/config', (req, res) => {
  expDB.find({ "versions.url": req.body.url }).exec(function (err, docs) {
    let name = "";
    for (let version of docs[0]["versions"]) {
      if (version["url"] === req.body.url) {
        console.log(version["url"]+" <-");
        name = version["type"];
      }
    }
    res.send({
      "experiment-id" : docs[0]["id"],
      "version-id" : name
    });
  });
});
