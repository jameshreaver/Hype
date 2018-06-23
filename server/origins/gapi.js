"use strict"

const {google} = require('googleapis');
const database = require('nedb');
const opn = require('opn');

var projectID = "";
var oauth2Client = {};
const scope = "https://www.googleapis.com/auth/cloud-platform";

const cloudbuild = google.cloudbuild('v1');
const container = google.container('v1');
var client;

function setProjectID(id) {
  projectID = id;
}

function getCluster() {
  const params = { projectId: projectID, zone: "-" };
  return container.projects.zones.clusters.list(params);
}

function createBuild(build) {
  console.log("* Started build on branch "
    + build.source.repoSource.branchName);
  const params = { projectId: projectID, resource: build };
  return cloudbuild.projects.builds.create(params);
}

function createTrigger(trigger) {
  console.log("* Created trigger for branch "
    + trigger.build.source.repoSource.branchName);
  const params = { projectId: projectID, resource: trigger };
  return cloudbuild.projects.triggers.create(params);
}

function deleteTrigger(id) {
  console.log("* Deleted trigger with id " + id);
  const params = { projectId: projectID, triggerId: id };
  return cloudbuild.projects.triggers.delete(params);
}

function authenticate(req, res, cdb) {
  client = new Promise(async (resolve, reject) => {
    try {
      res.end("Authentication successful!");
      const {tokens} = await oauth2Client
      .getToken(req.query.code);
      oauth2Client.setCredentials(tokens);
      cdb.update({ type: "auth" }, {
        type: "auth",
        data: tokens
      }, { upsert: true }, () => {});
      cdb.persistence.compactDatafile();
      resolve(oauth2Client);
    } catch (e) {
      reject(e);
    }
  });
}

function setupClient(cdb) {
  cdb.findOne({
    type: "config"
  }).exec((err, doc) => {
    oauth2Client = new google.auth.OAuth2(
      doc.data["client-id"],
      doc.data["client-secret"],
      doc.data["redirection"]
    );
    setupOAuth(cdb);
  });
}

function setupOAuth(cdb){
  google.options({ auth: oauth2Client });
  cdb.findOne({type: "auth"}).exec((err, doc) => {
    if (!doc || doc.data.expiry_date < new Date()) {
      let url = oauth2Client.generateAuthUrl({
        access_type: 'offline', scope: scope
      });
      opn(url, {wait: false}).then(cp => cp.unref());
    } else {
      oauth2Client.setCredentials(doc.data);
    }
  });
}

module.exports = {
  setProjectID,
  getCluster,
  createBuild,
  createTrigger,
  deleteTrigger,
  authenticate,
  setupClient
}
