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

async function authenticate() {
  oauth2Client.credentials = { access_token: 'ya29.GlzOBbOeM9pcOredUf1CNQH4Lv7NnTWi10RbBTRLiPEEmUMj_Jfc2tSo66jSHM1L7sApddKpZO4GeA9hbZuzSc2jwq4D-Ci1e6ESGOWbSqJ_XzI8qXC9Rrr1yx9Sng',token_type: 'Bearer',expiry_date: 1527986520357 };
return;
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
  getCluster,
  createBuild,
  createTrigger,
  deleteTrigger
}
