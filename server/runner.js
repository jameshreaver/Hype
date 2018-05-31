const api = require('./api');
const logger = require('./logger');
const k8s = require('./origins/k8s');

const registryURL = "gcr.io/booksnap-h/";

function runExperiment(req, res, db) {
  db.findOne({id: req.params.id}, {})
  .exec(function (err, exp) {
    let info = getInfo(exp);
    ensureAffinity(info.service);
    // logger.setRunning(db, info.id);
    // postTriggers(info);
    // postBuilds(info).then(
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
  }).catch(err =>
    console.log(err)
  );
}

function createMainDeployment(info, config) {
  let name = info["service"] +"-"+ info["main-branch"];
  let image = registryURL + name + ":4429d33";
  let replicas = 10-info["replicas"];
  createDeployment(name, image, replicas, config);
}

function createExpDeployment(info, config) {
  let name = info["service"] +"-"+ info["exp-branch"];
  let image = registryURL + name + ":dec988c";
  let replicas = info["replicas"];
  createDeployment(name, image, replicas, config);
}

function createDeployment(name, image, replicas, config) {
  let conf = JSON.parse(JSON.stringify(config));
  conf.metadata.name = name;
  conf.metadata.resourceVersion = '';
  conf.spec.replicas = replicas;
  if (image) conf.spec.template.spec.containers[0].image = image;
  conf.spec.template.spec.containers[0].imagePullPolicy = "Always";
  k8s.createDeployment(conf);
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

module.exports = {
  runExperiment,
  endExperiment,
  mergeExperiment
};
