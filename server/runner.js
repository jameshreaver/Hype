const api = require('./api');
const database = require('nedb');
const logger = require('./logger');
const gapi = require('./origins/gapi');
const k8s = require('./origins/k8s');

const projectID = "booksnap-h";
const registryURL = "gcr.io/booksnap-h/";

var tdb = new database({
  filename: './db/triggers.db',
  autoload: true
});

function runExperiment(req, res, db) {
  db.findOne({id: req.params.id}, {})
  .exec(function (err, exp) {
    let info = getInfo(exp);
    ensureAffinity(info.service);
    // logger.setRunning(db, info.id);
    createBuilds(info);
    createDeployments(info);
    console.log("Running experiment "
      + exp["info"]["title"]
    );
  });
  res.end();
}

function endExperiment(req, res, db) {
  db.findOne({id: req.params.id}, {})
  .exec(function (err, exp) {
    let info = getInfo(exp);
    let outocme = req.params.outcome;
    // logger.setPast(db, info.id, outcome, "ended");
    endDeployments(info, info["main-branch"]);
    console.log("Ending experiment "
      + exp["info"]["title"]
    );
  });
  res.end();
}

function mergeExperiment(req, res, db) {
  db.findOne({id: req.params.id}, {})
  .exec(function (err, exp) {
    let info = getInfo(exp);
    // logger.setPast(db, info.id, outcome, "merged");
    endDeployments(info, info["exp-branch"]);
    console.log("Meging experiment "
      + exp["info"]["title"]
    );
  });
  res.end();
}

function endDeployments(info, deployment) {
  let name = info["service"];
  k8s.getDeployment(name + "-" + deployment)
  .then(config => {
    deleteTriggers(info["id"]);
    createDeployment(name, "", 1, config);
    k8s.deleteDeployment(name + "-" + info["main-branch"]);
    k8s.deleteDeployment(name + "-" + info["exp-branch"]);
  }).catch(err =>
    console.log(err)
  );
}

function ensureAffinity(service) {
  k8s.patchService(service, {"spec":{
    "sessionAffinity":"ClientIP"
  }});
}

function createDeployments(info) {
  let name = info["service"];
  k8s.getDeployment(name)
  .then(config => {
    createMainDeployment(info, config);
    createExpDeployment(info, config);
    k8s.deleteDeployment(name);
    deleteTriggers(info["id"]);
  }).catch(err =>
    console.log(err)
  );
}

function createMainDeployment(info, config) {
  let name = info["service"] +"-"+ info["main-branch"];
  let image = "building"
  let replicas = 10-info["replicas"];
  createDeployment(name, image, replicas, config);
}

function createExpDeployment(info, config) {
  let name = info["service"] +"-"+ info["exp-branch"];
  let image = "building"
  let replicas = info["replicas"];
  createDeployment(name, image, replicas, config);
}

function createDeployment(name, image, replicas, config) {
  let conf = JSON.parse(JSON.stringify(config));
  conf.metadata.name = name;
  conf.metadata.resourceVersion = '';
  conf.spec.replicas = replicas;
  conf.spec.template.spec.containers[0].name = name;
  if (image) conf.spec.template.spec.containers[0].image = image;
  conf.spec.template.spec.containers[0].imagePullPolicy = "Always";
  k8s.createDeployment(conf);
}

function createBuilds(info) {
  gapi.getCluster().then(async res => {
    let cluster = res.data["clusters"][0];
    let triggerA = getTrigger(info, info["main-branch"], cluster);
    let triggerB = getTrigger(info, info["exp-branch"], cluster);
    gapi.createTrigger(triggerA).then(res => {
      saveTriggerId(info["id"], res.data.id)});
    gapi.createTrigger(triggerB).then(res => {
      saveTriggerId(info["id"], res.data.id)});
    gapi.createBuild(triggerA.build);
    gapi.createBuild(triggerB.build);
  });
}

function saveTriggerId(exp, id) {
  tdb.insert({exp: exp, id: id});
  tdb.persistence.compactDatafile();
}

function deleteTriggers(exp) {
  tdb.find({exp: exp})
  .exec((err, triggers) => {
    tdb.remove({exp: exp}, {multi: true});
    for (let trigger of triggers) {
      gapi.deleteTrigger(trigger.id);
    }
    tdb.persistence.compactDatafile();
  });
}

function getInfo(exp) {
  return  {
    "id": exp["id"],
    "service": exp["info"]["service"],
    "main-branch": exp["settings"]["main-branch"],
    "exp-branch": exp["settings"]["exp-branch"],
    "replicas": exp["settings"]["percentage"]/10
  };
}

function getTrigger(info, branch, cluster) {
  let repoSource = {
    "projectId": projectID,
    "repoName": info["service"],
    "branchName": branch};
  let container = info["service"]
    + "-" + branch;
  let substitutions = {
    "_NAME": info["service"],
    "_CONTAINER": container,
    "_CLUSTER": cluster.name,
    "_ZONE": cluster.zone,
    "_HYPE_EXP_ID": info["id"],
    "_HYPE_EXP_VERS": branch};
  return {
    "triggerTemplate": repoSource,
    "substitutions": substitutions,
    "build": {
      "source": {"repoSource": repoSource},
      "steps": steps,
      "substitutions": substitutions,
      "images" : ["gcr.io/$PROJECT_ID/"
      + "$_NAME-$BRANCH_NAME:$SHORT_SHA"]
    }
  };
}

const steps = [
  {
    "name": "gcr.io/cloud-builders/npm",
    "args": ["install", "--silent"]
  }, {
    "name": "gcr.io/cloud-builders/npm",
    "args": ["run", "build", "--silent"],
    "env": ["REACT_APP_HYPE_EXP_ID=$_HYPE_EXP_ID",
            "REACT_APP_HYPE_EXP_VERS=$_HYPE_EXP_VERS"]
  }, {
    "name": "gcr.io/cloud-builders/docker",
    "args": ["build", "-t", "gcr.io/$PROJECT_ID/$_NAME-$BRANCH_NAME:$SHORT_SHA", "."]
  }, {
    "name": "gcr.io/cloud-builders/docker",
    "args": ["push", "gcr.io/$PROJECT_ID/$_NAME-$BRANCH_NAME:$SHORT_SHA"]
  },{
    "name": "gcr.io/cloud-builders/kubectl",
    "args": ["set", "image", "deployment/$_NAME-$BRANCH_NAME",
    "$_CONTAINER=gcr.io/$PROJECT_ID/$_NAME-$BRANCH_NAME:$SHORT_SHA"],
    "env": ["CLOUDSDK_COMPUTE_ZONE=$_ZONE",
            "CLOUDSDK_CONTAINER_CLUSTER=$_CLUSTER"]
  }
];

module.exports = {
  runExperiment,
  endExperiment,
  mergeExperiment
};
