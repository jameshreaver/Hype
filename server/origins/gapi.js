"use strict"

const express = require('express');
const {google} = require('googleapis');
const opn = require('opn');

const projectID = "booksnap-h";
const authHost = "http://localhost:5101/";
const scope = "https://www.googleapis.com/auth/cloud-platform";
const oauth2Client = new google.auth.OAuth2(
  "921143521906-8q9p0pdo9lpr3uusnt24b2ab3moc23jt.apps.googleusercontent.com",
  "U1hNde536_p7RB-xn9YVIS3D",
  authHost + "api/auth"
);

const cloudbuild = google.cloudbuild('v1');
const container = google.container('v1');
google.options({ auth: oauth2Client });
var client = authenticate();

async function getCluster() {
  const params = { projectId: projectID, zone: "-" };
  return container.projects.zones.clusters.list(params);
}

async function createBuilds(info) {
  getCluster().then(async res => {
    let cluster = res.data["clusters"][0];
    let triggerA = getTrigger(info, info["main-branch"], cluster);
    let triggerB = getTrigger(info, info["exp-branch"], cluster);
    createBuild(triggerA.build);
    createBuild(triggerB.build);
    createTrigger(triggerA);
    createTrigger(triggerB);
  });
}

function createTrigger(trigger) {
  console.log("* Created trigger for branch "
    + trigger.build.source.repoSource.branchName);
  const params = { projectId: projectID, resource: trigger };
  return cloudbuild.projects.triggers.create(params);
}

function createBuild(build) {
  console.log("* Started build on branch "
    + build.source.repoSource.branchName);
  const params = { projectId: projectID, resource: build };
  return cloudbuild.projects.builds.create(params);
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

async function authenticate() {
  return new Promise((resolve, reject) => {
    const server = express();
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scope
    });
    server.get('/api/auth', async (req, res) => {
      try {
        res.end("Authentication successful!");
        const {tokens} = await oauth2Client
        .getToken(req.query.code);
        console.log(tokens);
        oauth2Client.credentials = tokens;
        resolve(oauth2Client);
      } catch (e) {
        reject(e);
    }}).listen(5101, function() {
      opn(authorizeUrl, {wait: false})
      .then(cp => cp.unref());
    });
  });
}

oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    oauth2client.setCredentials({
      refresh_token: tokens.refresh_token
    });
  }
});

module.exports = {
  createBuilds
}
